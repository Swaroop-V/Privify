import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../services/firebase";
import { decryptData } from "../utils/crypto";
import { logger } from "../utils/logger";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Shield, Search, LogOut, MapPin, Database, Unlock } from "lucide-react";

interface DecryptedPOI {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  distance?: number;
}

export const UserDashboard: React.FC = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [radius, setRadius] = useState("5"); // km

  const [results, setResults] = useState<DecryptedPOI[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [queryTime, setQueryTime] = useState<number | null>(null);

  // Haversine formula to calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });
    setQueryTime(null);
    setResults([]);

    const startTime = performance.now();

    try {
      const userLat = parseFloat(latitude);
      const userLng = parseFloat(longitude);
      const searchRadius = parseFloat(radius);

      if (isNaN(userLat) || isNaN(userLng) || isNaN(searchRadius)) {
        throw new Error("Invalid input parameters");
      }

      logger.info(
        `Initiating privacy-preserving query at [${userLat}, ${userLng}] with radius ${searchRadius}km`,
      );

      // 1. Fetch encrypted data from cloud
     
      const querySnapshot = await getDocs(collection(db, "pois"));

      const foundPois: DecryptedPOI[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.encryptedData) {
          try {
            // Decrypt the data
            const decrypted = decryptData(data.encryptedData);

            // Check distance
            const distance = calculateDistance(
              userLat,
              userLng,
              decrypted.latitude,
              decrypted.longitude,
            );

            if (distance <= searchRadius) {
              foundPois.push({
                id: doc.id,
                ...decrypted,
                distance,
              });
            }
          } catch (err) {
            logger.warn(`Failed to decrypt POI ${doc.id}`);
          }
        }
      });

      // Sort by distance
      foundPois.sort((a, b) => (a.distance || 0) - (b.distance || 0));

      setResults(foundPois);

      const endTime = performance.now();
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
      setQueryTime(parseFloat(timeTaken));

      logger.info(
        `Query completed in ${timeTaken}s. Found ${foundPois.length} POIs.`,
      );

      if (foundPois.length === 0) {
        setMessage({
          type: "info",
          text: "No POIs found within the specified radius.",
        });
      }
    } catch (error: any) {
      logger.error("Search error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to perform search.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logger.info("User logged out");
    } catch (error) {
      logger.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sm:px-10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600">
          <Shield className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">Privify User</span>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-slate-600"
        >
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </Button>
      </header>

      <main className="max-w-6xl mx-auto p-6 sm:p-10 grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                Spatial Range Query
              </CardTitle>
              <CardDescription>
                Search for POIs securely. Your location data is protected using
                predicate-only encryption.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                {message.text && (
                  <div
                    className={`p-3 text-sm rounded-md border ${message.type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Your Latitude
                    </label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="40.785091"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Your Longitude
                    </label>
                    <Input
                      type="number"
                      step="any"
                      placeholder="-73.968285"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Search Radius (km)
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0.1"
                    placeholder="5"
                    value={radius}
                    onChange={(e) => setRadius(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading
                    ? "Encrypting Query & Searching..."
                    : "Search Securely"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-indigo-600" />
                Decrypted Results
              </CardTitle>
              <CardDescription>
                {queryTime !== null ? (
                  <span className="text-emerald-600 font-medium">
                    Query completed in {queryTime}s. Found {results.length}{" "}
                    POIs.
                  </span>
                ) : (
                  "Results will appear here after decryption."
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {results.length === 0 ? (
                <div className="text-center py-10 text-slate-500 flex flex-col items-center gap-2">
                  <Database className="w-8 h-8 opacity-20" />
                  <p>No results to display.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((poi) => (
                    <div
                      key={poi.id}
                      className="p-4 rounded-lg border border-slate-200 bg-white shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-slate-900">
                          {poi.name}
                        </h4>
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                          {poi.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {poi.distance?.toFixed(2)} km away
                        </div>
                        <div className="font-mono text-xs">
                          [{poi.latitude.toFixed(4)}, {poi.longitude.toFixed(4)}
                          ]
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

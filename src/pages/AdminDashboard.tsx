import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../services/firebase";
import { encryptData } from "../utils/crypto";
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
import { Shield, Upload, LogOut, Database, MapPin } from "lucide-react";

interface POI {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  encryptedData: string;
  createdAt: any;
}

export const AdminDashboard: React.FC = () => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [category, setCategory] = useState("");

  const [pois, setPois] = useState<POI[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchPOIs();
  }, []);

  const fetchPOIs = async () => {
    try {
      const q = query(collection(db, "pois"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedPois: POI[] = [];
      querySnapshot.forEach((doc) => {
        fetchedPois.push({ id: doc.id, ...doc.data() } as POI);
      });
      setPois(fetchedPois);
      logger.info(`Fetched ${fetchedPois.length} POIs`);
    } catch (error) {
      logger.error("Error fetching POIs:", error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        throw new Error("Invalid coordinates");
      }

      const rawData = {
        name,
        latitude: lat,
        longitude: lng,
        category,
      };

      // Encrypt the POI data before uploading
      logger.info("Encrypting POI data for upload");
      const encryptedData = encryptData(rawData);

      // Store in Firestore
      await addDoc(collection(db, "pois"), {
        encryptedData,
        createdAt: serverTimestamp(),
      });

      logger.info("POI data uploaded and encrypted successfully");
      setMessage({
        type: "success",
        text: "Data uploaded and encrypted successfully.",
      });

      // Reset form
      setName("");
      setLatitude("");
      setLongitude("");
      setCategory("");

      fetchPOIs();
    } catch (error: any) {
      logger.error("Upload error:", error);
      setMessage({
        type: "error",
        text: error.message || "Failed to upload data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logger.info("Admin logged out");
    } catch (error) {
      logger.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-6 sm:px-10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600">
          <Shield className="w-6 h-6" />
          <span className="text-xl font-bold tracking-tight">Privify Admin</span>
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
                <Upload className="w-5 h-5 text-indigo-600" />
                Upload POI Data
              </CardTitle>
              <CardDescription>
                Add new Points of Interest. Data will be encrypted before being
                stored in the cloud.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                {message.text && (
                  <div
                    className={`p-3 text-sm rounded-md border ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}
                  >
                    {message.text}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    POI Name
                  </label>
                  <Input
                    placeholder="e.g., Central Park"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Latitude
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
                      Longitude
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
                    Category
                  </label>
                  <Input
                    placeholder="e.g., Park, Restaurant, Hospital"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Encrypting & Uploading..." : "Encrypt & Upload"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Encrypted Database
              </CardTitle>
              <CardDescription>
                Overview of data currently stored in the cloud.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {pois.length === 0 ? (
                <div className="text-center py-10 text-slate-500 flex flex-col items-center gap-2">
                  <Database className="w-8 h-8 opacity-20" />
                  <p>No POI data found in the cloud.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pois.map((poi) => (
                    <div
                      key={poi.id}
                      className="p-4 rounded-lg border border-slate-200 bg-slate-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 text-slate-700 font-mono text-xs break-all">
                          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                          {poi.encryptedData.substring(0, 40)}...
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        Encrypted Spatial Record
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

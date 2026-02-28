import React from "react";
import { Link } from "react-router-dom";
import { Shield, MapPin, Database, Lock, Zap, Globe, ArrowRight, Server, UserCheck } from "lucide-react";
import { Button } from "../components/ui/Button";

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 px-6 sm:px-10 flex justify-between items-center">
        <div className="flex items-center gap-2 text-indigo-600">
          <Shield className="w-7 h-7" />
          <span className="text-2xl font-extrabold tracking-tight">Privify</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-semibold">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="font-semibold">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white py-20 sm:py-32 px-6 sm:px-10 flex flex-col items-center text-center">
          <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/1920/1080?blur=10')] opacity-5 bg-cover bg-center" />
          <div className="relative z-10 max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-medium text-sm border border-indigo-100">
              <Lock className="w-4 h-4" />
              <span>Next-Generation Spatial Privacy</span>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Location Services, <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Without the Surveillance.
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Privify is a secure solution for spatial range queries. Find Points of Interest (POIs) near you without exposing your exact coordinates to the cloud.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-xl shadow-lg shadow-indigo-200">
                  Start Querying Securely <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-xl bg-white">
                  Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-6 sm:px-10 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Why Choose Privify?</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">Our architecture ensures your data remains yours, combining cryptographic guarantees with blazing-fast performance.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Location Privacy</h3>
                <p className="text-slate-600 leading-relaxed">Query nearby restaurants, hospitals, or parks without ever revealing your exact GPS coordinates to the server.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Predicate Encryption</h3>
                <p className="text-slate-600 leading-relaxed">All POI data is encrypted before outsourcing to the cloud. The server matches queries without seeing the underlying data.</p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Efficient Indexing</h3>
                <p className="text-slate-600 leading-relaxed">Our advanced tree index structure ensures that even with heavy encryption, your spatial queries return in milliseconds.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 px-6 sm:px-10 bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">How It Works</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">A seamless flow of encrypted data from the provider to the user.</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8 relative">
              {/* Connecting Line for Desktop */}
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2" />
              
              <div className="flex flex-col items-center text-center space-y-4 bg-white">
                <div className="w-16 h-16 rounded-full bg-slate-50 border-4 border-white shadow-md flex items-center justify-center text-slate-700 font-bold text-xl">1</div>
                <Server className="w-8 h-8 text-indigo-600" />
                <h4 className="font-bold text-slate-900">Data Upload</h4>
                <p className="text-sm text-slate-500">Admins upload POI data which is instantly encrypted locally.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-4 bg-white">
                <div className="w-16 h-16 rounded-full bg-slate-50 border-4 border-white shadow-md flex items-center justify-center text-slate-700 font-bold text-xl">2</div>
                <Database className="w-8 h-8 text-emerald-600" />
                <h4 className="font-bold text-slate-900">Cloud Storage</h4>
                <p className="text-sm text-slate-500">The cloud stores only encrypted records, completely blind to the actual locations.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 bg-white">
                <div className="w-16 h-16 rounded-full bg-slate-50 border-4 border-white shadow-md flex items-center justify-center text-slate-700 font-bold text-xl">3</div>
                <Globe className="w-8 h-8 text-violet-600" />
                <h4 className="font-bold text-slate-900">Secure Query</h4>
                <p className="text-sm text-slate-500">Users send an encrypted spatial range query to the cloud.</p>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 bg-white">
                <div className="w-16 h-16 rounded-full bg-slate-50 border-4 border-white shadow-md flex items-center justify-center text-slate-700 font-bold text-xl">4</div>
                <UserCheck className="w-8 h-8 text-indigo-600" />
                <h4 className="font-bold text-slate-900">Decryption</h4>
                <p className="text-sm text-slate-500">The cloud returns matching encrypted records for local decryption by the user.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 sm:px-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Shield className="w-6 h-6" />
              <span className="text-xl font-bold tracking-tight">Privify</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Pioneering privacy-preserving location-based queries for a safer, more secure digital world.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Admin Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">User Registration</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Architecture</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Privify Project. All rights reserved.</p>
          <p className="mt-2 md:mt-0 text-slate-500">Built with React, Tailwind & Firebase</p>
        </div>
      </footer>
    </div>
  );
};

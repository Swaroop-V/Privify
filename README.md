# Privify (Efficient Privacy-Preserving Location-Based Query)

Privify is a secure, privacy-preserving location-based query system. It allows users to find nearby Points of Interest (POIs) without exposing their exact GPS coordinates to the cloud provider, and allows data owners (Admins) to outsource their POI data without revealing the underlying locations.

---

## 🔄 Basic Workflow

The system utilizes a **Hybrid Cloud-Edge Architecture**. The cloud (Firebase) acts as a blind storage locker, while all cryptographic operations and spatial filtering happen locally on the user's device (Edge).

### 1. Admin Workflow (Data Owner)
1. **Authentication:** The Admin registers or logs into the system.
2. **Data Entry:** The Admin enters details for a new Point of Interest (Name, Category, Latitude, Longitude).
3. **Local Encryption:** Before the data leaves the device, it is encrypted locally using AES encryption (via CryptoJS).
4. **Cloud Storage:** The encrypted ciphertext is sent to the cloud database (Firebase Firestore). The cloud never sees the raw data.

### 2. User Workflow (End User)
1. **Authentication:** The User registers or logs into the system.
2. **Query Input:** The User enters their current location (Latitude, Longitude) and a search radius (e.g., 5 km).
3. **Data Retrieval:** The application fetches the encrypted POI dataset from the cloud database.
4. **Local Decryption & Filtering:** The application decrypts the dataset locally on the user's device. It then calculates the Haversine distance between the user's coordinates and each POI.
5. **Result Display:** Only the POIs that fall within the specified radius are displayed to the user. The user's coordinates are never sent to the server.

---

## 🚀 Execution (How to Run the Project)

### Prerequisites
* **Node.js** installed on your machine (v18+ recommended).
* A **Google Firebase** account.

### Step 1: Install Dependencies
Open your terminal, navigate to the project folder, and run:
```bash
npm install
```

### Step 2: Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Add a **Web App** to the project to get your configuration keys.
3. Go to **Authentication**, click **Get Started**, and enable the **Email/Password** sign-in method.
4. Go to **Firestore Database**, click **Create database**, and start in **Test mode**.
5. Go to the **Rules** tab in Firestore and ensure read/write access is allowed for development:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true; 
       }
     }
   }
   ```

### Step 3: Environment Configuration
1. In the root of your project folder (next to `package.json`), create a file named exactly `.env`.
2. Add your Firebase keys and a secret encryption key:
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"

# Secret key for AES encryption (can be any random string)
VITE_ENCRYPTION_KEY="my-super-secret-encryption-key-2026"
```

### Step 4: Start the Development Server
Run the following command to start the app:
```bash
npm run dev
```
Open the provided local URL (usually `http://localhost:3000` or `http://localhost:5173`) in your browser.

---

## 🧪 Test Cases

Follow these test cases to verify the entire system works correctly.

### Test Case 1: Admin Registration & Login
* **Action:** Navigate to the Register page. Select "Admin" as the Account Type. Enter an email and password, then click Register.
* **Expected Result:** Account is created successfully, and you are redirected to the "Privify Admin" dashboard.

### Test Case 2: Secure POI Upload (Admin)
* **Action:** On the Admin Dashboard, enter the following details:
  * Name: `Central Park`
  * Latitude: `40.785091`
  * Longitude: `-73.968285`
  * Category: `Park`
* **Action:** Click "Encrypt & Upload".
* **Expected Result:** A success message appears. The "Encrypted Database" section on the right updates to show a new record containing random ciphertext (e.g., `U2FsdGVkX1...`).

### Test Case 3: Verify Encrypted Storage (Cloud Verification)
* **Action:** Open your Firebase Console in the browser. Go to Firestore Database -> `pois` collection.
* **Expected Result:** The document stored in the database only contains an `encryptedData` string and a timestamp. The raw words "Central Park" or the coordinates are nowhere to be found in the database.

### Test Case 4: User Registration & Login
* **Action:** Log out of the Admin account. Go to the Register page. Select "User" as the Account Type. Enter a new email and password, then click Register.
* **Expected Result:** Account is created successfully, and you are redirected to the "Privify User" dashboard.

### Test Case 5: Secure Spatial Query (User - Within Radius)
* **Action:** On the User Dashboard, enter coordinates that are very close to Central Park:
  * Latitude: `40.780000`
  * Longitude: `-73.960000`
  * Radius: `5` (km)
* **Action:** Click "Search Securely".
* **Expected Result:** The system fetches the encrypted data, decrypts it locally, calculates the distance, and successfully displays "Central Park" in the Results section, showing that it is within 5km.

### Test Case 6: Out-of-bounds Query (User - Outside Radius)
* **Action:** Change the search radius to `0.1` (km) or enter coordinates far away (e.g., Latitude: `34.0522`, Longitude: `-118.2437` for Los Angeles).
* **Action:** Click "Search Securely".
* **Expected Result:** The Results section shows "No POIs found in this area." The system correctly filtered out Central Park because it is outside the specified radius.

# 💊 MedVoice — Voice-Based Medicine Assistant

> **Making medicine information easier to understand through an accessible, voice-first experience.**

MedVoice is a voice-oriented medicine-reader application prototype designed to make medicine information easier to access for older adults, people with low literacy, and users who may find small text or complex interfaces difficult to use.

The interface demonstrates a guided medicine-scanning journey, medicine details, expiry-status labels, a medicine history screen, settings, and a privacy-focused caregiver-access screen. It uses a high-contrast dark interface, large labels, and visible voice-status feedback.

> **Project status:** This repository contains a front-end prototype. Some flows are simulated with sample medicine data and timed UI transitions. Do not treat the current prototype as a verified medicine-identification or medical-advice system.

---

## 🌐 Project Links

| Resource | Link |
| --- | --- |
| 💻 Repository | Add your GitHub repository URL |
| 🚀 Live Demo | Add your deployed demo URL, if available |
| 🎥 Demonstration Video | Add your demo video URL, if available |

---

# 🎯 Problem Statement

Medicine packaging can be difficult to understand, especially for people who have difficulty reading small print, understanding medical terminology, or navigating conventional mobile applications.

### Common challenges

- 🔎 Medicine names, strengths, and expiry dates may be printed in small text.
- 🗣️ Typing and navigating multiple screens can be difficult for some users.
- 🧾 Users may need a simple way to review medicines they have scanned.
- ⚠️ Confusing or incorrectly read medicine information can lead to unsafe decisions.
- 👨‍👩‍👧 Family members or caregivers may need access, while the user's privacy must still be protected.

**MedVoice explores a voice-first, accessibility-focused interface for presenting medicine information in a clearer way.**

---

# 💡 Our Solution

MedVoice organizes the experience around a simple flow:

```text
OPEN APP
   ↓
WELCOME / VOICE STATUS
   ↓
CHOOSE AN ACTION
   ├── Scan Medicine
   ├── My Medicines
   ├── Settings
   └── Caregiver Mode
          ↓
   Medicine Details / History / Access Screen
```

## 👤 Main user experience

- A welcome screen introduces the assistant.
- A home screen presents the main actions with large, visually distinct cards.
- The scan flow shows a camera preview when browser camera access is available.
- A medicine result screen presents the name, active ingredient, strength, expiry status, general use, and warnings.
- The history screen lists example medicines with expiry labels.
- The caregiver screen communicates that authorization is required before caregiver access.

## ♿ Accessibility goals

- Large, high-contrast text and clear status labels
- Simple cards and recognizable icons
- Visible voice-state feedback
- A guided, low-complexity navigation flow
- A design intended to support users who prefer spoken interaction

**Important:** The current code simulates voice-command transitions; it does not implement a complete speech-recognition and text-to-speech pipeline. Touch-free operation is a design goal, not a verified capability of this prototype.

---

# 🖼️ Application Screenshots

Place your screenshots in a folder named `screenshots/` in the repository, using the filenames shown below. Update the paths if your filenames differ.

## 1. 💊 Welcome Screen

![MedVoice welcome screen](./screenshots/welcome.png)

The welcome screen introduces MedVoice and displays the voice-status indicator and greeting.

## 2. 🏠 Home Screen

![MedVoice home screen](./screenshots/home.png)

The home screen presents the main actions:

- 📷 Scan Medicine
- 💊 My Medicines
- 👨‍👩‍👧 Caregiver Mode
- ⚙️ Settings

## 3. 🧾 My Medicines / History

![MedVoice medicine history](./screenshots/medicine-history.png)

The history view demonstrates medicine cards with:

- Medicine name and strength
- Active ingredient
- Scan-time label
- Expiry date
- Valid, expiring-soon, or expired status

The current screen uses hard-coded example data rather than a persistent personal medicine database.

## 4. 🔐 Caregiver Authorization Screen

![MedVoice caregiver authorization](./screenshots/caregiver.png)

The caregiver screen explains that authorization is required and displays example voice commands such as requesting an OTP, entering a PIN, or cancelling.

The screen is a UI demonstration. A production implementation would need a secure authentication service and a real OTP/PIN verification flow.

## 5. 🔎 Medicine Scan Result

![MedVoice medicine scan result](./screenshots/medicine-result.png)

The result view demonstrates a medicine-information layout containing:

- Medicine name
- Active ingredient
- Strength
- Expiry status
- General use
- Warnings
- Navigation to questions, home, and history

The displayed Paracetamol example is sample content. The current prototype does not prove that the medicine was identified from the camera image.

---

# ✨ Key Features Demonstrated

## 1. 📷 Camera preview for scanning

The scan screen requests access to the browser camera and displays a live preview when permission and device support are available.

If camera access fails, the interface shows an error message and allows the user to continue through a simulated scan flow.

**Current limitation:** The scan progress and result are simulated. Image capture is not connected to OCR or a medicine-identification model in the current implementation.

## 2. 💊 Medicine information cards

The result screen displays fields such as:

- Medicine name
- Active ingredient
- Strength
- General use
- Expiry date/status
- Warnings

The example content is embedded in the front-end code. It should not be used to make medication decisions.

## 3. 📅 Expiry status labels

Medicine cards visually distinguish three states:

- 🟢 **Valid**
- 🟠 **Expiring Soon**
- 🔴 **Expired**

These labels are preconfigured for the sample medicines in the prototype. Automatic expiry extraction and date verification from real packaging are not implemented.

## 4. 🗂️ Medicine history interface

The history screen shows a list of previously scanned medicine examples and provides example voice-query prompts.

**Current limitation:** The list is initialized from static sample data and is not saved to a persistent database or browser storage.

## 5. 🛡️ Caregiver access concept

The caregiver screen demonstrates a privacy-conscious access step instead of automatically displaying a complete medicine history.

**Current limitation:** The displayed PIN/OTP instructions are not connected to a real verification backend. Do not use this screen as actual authentication.

## 6. 🎙️ Voice-oriented interaction design

The UI shows voice-active status, assistant messages, transcripts, and processing/speaking indicators to communicate the intended interaction style.

**Current limitation:** The current implementation uses timed state transitions and example commands. It does not contain a complete microphone-based command-recognition engine or automatic spoken output.

---

# 🧱 Application Architecture

```text
                    MEDVOICE FRONT-END PROTOTYPE
                               |
                               v
                    React Application (App.tsx)
                               |
             +-----------------+-----------------+
             |                 |                 |
             v                 v                 v
        Home Screen        Scan Flow         History Screen
             |                 |                 |
             |                 v                 |
             |          Browser Camera           |
             |          Preview (optional)        |
             |                 |                 |
             |          Simulated Scan            |
             |                 |                 |
             +-----------------+-----------------+
                               |
                               v
                    Sample Medicine Information
                               |
                 +-------------+-------------+
                 |             |             |
                 v             v             v
              Result        Settings      Caregiver UI
```

The current project is a client-side React prototype. It does not include a separate backend service or database in the supplied project files.

---

# 🛠️ Technology Stack

| Category | Technology |
| --- | --- |
| Frontend | React 19 |
| Language | TypeScript |
| Build tool / development server | Vite |
| Styling | CSS and Tailwind CSS 4 integration |
| Browser camera | `navigator.mediaDevices` camera API |
| UI state | React hooks (`useState`, `useEffect`, `useRef`) |
| Sample medicine data | Hard-coded TypeScript data |
| Package manager | pnpm lockfile included; npm can also be used |
| Version control | Git (if initialized in your local repository) |

---

# 📁 Project Structure

```text
App Development/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── assets/
│   │   └── reference.png
│   └── imports/
│       └── pasted_text/
│           └── voice-medicine-reader-prompt.md
├── index.html
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vite.config.ts
└── README.md
```

Add a `screenshots/` directory to the repository if you want the screenshots in this README to render on GitHub.

---

# 🚀 Installation & Setup

## Prerequisites

Install:

- **Node.js** — a version compatible with the Vite version in `package.json`
- **pnpm** (recommended, because the project includes `pnpm-lock.yaml`) or npm

Check your installed versions:

```bash
node --version
pnpm --version
```

## 1. Extract or clone the project

If you downloaded the ZIP, extract it and open a terminal in the project folder.

If you have pushed the project to GitHub, clone your own repository:

```bash
git clone <your-repository-url>
cd <your-project-folder>
```

## 2. Install dependencies

Using pnpm:

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

## 3. Start the development server

Using pnpm:

```bash
pnpm dev
```

Or using npm:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal. The exact port may vary if the default port is already in use.

## 4. Create a production build

```bash
pnpm build
```

Or:

```bash
npm run build
```

To preview the production build locally:

```bash
pnpm preview
```

---

# 🔐 Security, Privacy & Medical Safety

Medicine information and scan history can be sensitive. A production-ready version should include:

- 🔒 Secure handling of personal and medicine data
- 🧑‍⚕️ Reliable, traceable sources for medicine information
- 🔎 Confidence checks for OCR and medicine identification
- 🧾 Clear separation between verified data and uncertain readings
- 🔐 Real authentication and authorization for caregiver access
- 🗃️ User-controlled storage, export, and deletion of history
- 🔊 Explicit permission and clear feedback for microphone and camera use
- ♿ Accessibility testing with intended users

Never infer a medicine, strength, dosage, warning, pregnancy-related advice, or expiry date when the packaging is unclear. Ask the user to rescan or consult a pharmacist/healthcare professional.

---

# ⚠️ Current Prototype Limitations

The supplied source code supports a front-end demonstration, not a complete medical product.

- **Voice recognition:** command transitions are simulated; real speech recognition is not implemented.
- **Spoken output:** assistant messages are displayed, but a complete text-to-speech implementation is not present.
- **Medicine scanning:** camera preview is available where supported; OCR and image-based identification are not implemented.
- **Medicine data:** examples are hard-coded in the front end.
- **History:** no persistent database or local history storage is implemented.
- **Expiry checking:** statuses are predefined for sample records rather than extracted and verified from packaging.
- **Caregiver security:** OTP/PIN instructions are visual placeholders without a real authentication service.
- **Language detection:** the current UI displays English; automatic multilingual detection and translation are not implemented.
- **Notifications and reports:** scheduled expiry alerts and PDF report generation are not implemented in the supplied source.
- **Medical validation:** the displayed medicine descriptions and warnings are examples and must be verified before any real-world use.

---

# 🔮 Future Enhancements

## 🎙️ 1. Real voice interaction

- Integrate browser speech recognition or a suitable speech-to-text service.
- Add text-to-speech for every prompt and result.
- Support voice commands, confirmations, error recovery, and hands-free navigation.
- Provide a clear fallback when microphone permissions or speech services are unavailable.

## 🔎 2. OCR and medicine verification

- Capture a medicine-package image.
- Read printed text with an OCR engine.
- Extract the medicine name, strength, manufacturer, batch details, and expiry date where legible.
- Compare results against a trusted medicine-information source.
- Display confidence and ask for a rescan when details are uncertain.

## 🌐 3. Multilingual accessibility

- Add supported Indian and international languages.
- Detect the spoken language only where reliable.
- Let users confirm or correct the detected language by voice.
- Localize medicine explanations without changing their clinical meaning.

## 🗂️ 4. Secure medicine history

- Store history only with clear user consent.
- Add edit, export, and delete controls.
- Protect sensitive records using appropriate encryption and access controls.

## 🔐 5. Verified caregiver access

- Integrate a real authentication service.
- Use secure OTP delivery and verification or another suitable consent-based method.
- Limit caregiver permissions to the information the user authorizes.

## 🔔 6. Expiry reminders and reports

- Add reminders based on verified expiry dates.
- Make uncertainty visible and avoid reminders based on unreadable dates.
- Generate accessible medicine-history reports with source and verification information.

---

# 🎥 Project Demonstration

Add a screen-recording or demo link here.

Suggested demo sequence:

1. Open the MedVoice welcome screen.
2. Show the home screen and its main actions.
3. Open the scan screen and demonstrate camera permission handling.
4. Show the simulated scanning progress and result.
5. Review the medicine-history cards and expiry labels.
6. Open the caregiver authorization screen.
7. Explain which capabilities are implemented and which are planned.

---

# 🏆 Project Highlights

MedVoice brings together:

```text
       Accessibility-First Design
                 +
       Voice-Oriented Interaction
                 +
       Medicine Information UI
                 +
       Expiry Status Visualization
                 +
       History and Caregiver Concepts
```

The project demonstrates how a simplified, voice-oriented interface could make medicine information easier to navigate. Real-world use requires verified medicine data, working speech and OCR systems, secure storage and authentication, and clinical safety review.

---

# 👩‍💻 Author

**Add your name here**

- GitHub: https://github.com/janesa123
- Project repository: Add the repository URL

---

## 💊 MedVoice

> **Understand medicine information more clearly, one step at a time.**

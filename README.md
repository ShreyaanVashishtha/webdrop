# 📡 WebDrop

**Zero-Login, Fast P2P Browser File Transfer with an Apple AirDrop-Inspired Radar UI**

WebDrop turns any modern desktop or mobile browser into a high-speed, direct peer-to-peer file transfer terminal without accounts, software installation, or intermediary file storage servers.

---

## ✨ Features

- **🎯 Apple-Inspired Radar Discovery**: Circular live radar animation (`#radar-container`) that scans for nearby devices on the same network using ephemeral Firebase presence heartbeats.
- **🌐 Multi-Peer Mesh / "Room Radar"**: Connect 3 or more devices simultaneously into a mesh room. Choose to broadcast files and text to all connected devices at once or click individual peer chips to send to a specific target. Invite additional devices anytime with the in-room "Add Device" QR & PIN modal.
- **🔐 Zero-Knowledge End-to-End Encryption (E2EE)**: Hardware-accelerated **AES-256-GCM** encryption powered by ephemeral **ECDH (P-256)** key exchange via `window.crypto.subtle`. Verify your connection via a 4-emoji cryptographic fingerprint and 16-digit safety numbers.
- **🔄 Fault-Tolerant Transfer Resume**: Interrupted transfers automatically resume from their exact byte offset using persistent **OPFS checkpoints**. If Wi-Fi blips or a peer temporarily disconnects mid-transfer, re-initiating the transfer resumes seamlessly from the saved checkpoint instead of starting from 0%.
- **✈️ Zero-Internet / Airplane Mode (Visual Handshake)**: Transfer files completely off-grid with zero internet connection or STUN servers. Devices exchange raw WebRTC Session Description Protocol (SDP) tokens directly via animated scannable QR codes or camera scanner.
- **🖥️ Ultra-Low Latency Screen Casting**: Live 60 FPS sub-50ms screen sharing and presentation mode via WebRTC `MediaStream`. Connected devices can view broadcasts in real time with Picture-in-Picture (PiP) and Fullscreen controls.
- **📲 PWA & Web Share Target**: Fully installable Progressive Web App. Integrates directly into your smartphone's native OS **"Share..."** menu, intercepting shared photos, videos, and links via the Service Worker & IndexedDB.
- **🚀 High-Throughput WebRTC Streaming**: Implements non-blocking DataChannel streaming with backpressure flow control (`bufferedAmount` & `bufferedamountlow`). Eliminates stop-and-wait ACK bottlenecks and maximizes local transfer speeds (50–100+ MB/s).
- **⚡ Live Transfer Metrics**: Real-time throughput speed (MB/s or KB/s), dynamic ETA calculation, and transferred byte counter alongside a smooth gradient progress bar.
- **📋 Instant Clipboard & Text/Link Sharing**: Beam text snippets, URLs, code blocks, and Wi-Fi credentials with one click or `Cmd+Enter`.
- **👁️ Quick Look Previews**: macOS-style preview modal for incoming images, audio, video playback, and syntax-rendered text files before saving.
- **💾 OPFS Stream-to-Disk**: Streams large incoming files directly to disk using the Origin Private File System (`navigator.storage.getDirectory()`) to avoid RAM bloat.
- **📱 Instant QR Code Pairing**: Generate an instant QR code for mobile devices. Scanning automatically navigates to the session URL with `?c=PIN`, auto-fills the pairing PIN, and connects hands-free.
- **🔋 Screen Wake Lock**: Automatically activates the Screen Wake Lock API during active file transfers so mobile devices don't sleep mid-transfer.
- **⚖️ Privacy & Terms Disclosures**: Dedicated zero-data collection [Privacy Policy](privacy.html) and [Terms of Service](terms.html) pages outlining WebDrop's peer-to-peer, zero-knowledge architecture.

---

## 🛠️ Architecture & Under the Hood

```
[ Device A (Sender) ]                                  [ Device B (Receiver) ]
         │                                                        │
         ├────── 1. Ephemeral Heartbeat (IP/PIN Presence) ───────┤ (Firestore)
         │                                                        │
         ├────── 2. WebRTC Handshake (STUN / PeerJS) ─────────────┤
         │                                                        │
         ├────── 3. Ephemeral ECDH (P-256) Key Exchange ─────────┤ (E2EE Handshake)
         │          - Derives 256-bit AES-GCM Symmetric Key       │
         │          - Computes SHA-256 Safety Emoji Fingerprint   │
         │                                                        │
         ├══════ 4. Encrypted Direct SCTP DataChannel ════════════╡ (P2P Wire)
         │          - 64 KB Slices + 12-byte IV + AES-GCM Tag     │
         │          - 1 MB Backpressure Buffer Window             │
         │          - Live Speed & Dynamic ETA Calculation        │
         │                                                        │
         └────── 5. EOF & Automatic Download Assembly ────────────┘
```

1. **Signaling & Presence**: Devices register an ephemeral presence record via Firebase Firestore tagged with a public IP hash and a 5-digit PIN. The live snapshot updates the circular radar in real time.
2. **WebRTC Direct DataChannel & Mesh**: Peer connections are established directly using Google's public STUN servers. Data is transferred strictly peer-to-peer using DTLS/SCTP encryption—files never hit any intermediate server.
3. **Application-Layer Zero-Knowledge E2EE**: Ephemeral Elliptic Curve Diffie-Hellman (ECDH) on curve P-256 is negotiated across the channel. File chunks and text snippets are encrypted in memory with AES-256-GCM before transmission.
4. **Backpressure Flow Control**: Instead of waiting for round-trip acknowledgments per chunk, WebDrop keeps a 1 MB sliding window in flight and listens to `bufferedamountlow` across all active data channels to prevent buffer bloat while maintaining line rate.
5. **PWA Web Share Target**: The Service Worker intercepts `POST` requests from the system Share Sheet, deposits shared files/text into IndexedDB, and prompts the user to beam them as soon as a peer connects.

---

## 🚀 Running Locally

WebDrop is a static web application that requires no complex build step. You can serve it with any local static HTTP server:

```bash
# Using Python
python3 -m http.server 3000

# Using Node.js (npx)
npx serve .
```

Then open `http://localhost:3000` in two different browser tabs or devices.

---

## 📋 Technologies Used

- **WebRTC & PeerJS**: Peer-to-peer data transport over SCTP
- **Web Crypto API**: Native `crypto.subtle` AES-256-GCM and ECDH P-256 key exchange
- **Service Worker & IndexedDB**: Web Share Target OS integration and offline shell caching
- **Firebase Firestore**: Ephemeral device presence and discovery heartbeat
- **Origin Private File System (OPFS)**: High-speed zero-memory disk streaming
- **Tailwind CSS**: Apple-inspired obsidian glassmorphism UI
- **Phosphor Icons**: Minimalist icon set
- **QRCode.js**: Instant client-side QR generation for smartphone pairing

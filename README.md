# 📡 WebDrop

**Zero-Login, Fast P2P Browser File Transfer with an Apple AirDrop-Inspired Radar UI**

WebDrop turns any modern desktop or mobile browser into a high-speed, direct peer-to-peer file transfer terminal without accounts, software installation, or intermediary file storage servers.

---

## ✨ Features

- **🎯 Apple-Inspired Radar Discovery**: Circular live radar animation (`#radar-container`) that scans for nearby devices on the same network using ephemeral Firebase presence heartbeats.
- **🚀 High-Throughput WebRTC Streaming**: Implements non-blocking DataChannel streaming with backpressure flow control (`bufferedAmount` & `bufferedamountlow`). Eliminates stop-and-wait ACK bottlenecks and maximizes local transfer speeds (50–100+ MB/s).
- **⚡ Live Transfer Metrics**: Real-time throughput speed (MB/s or KB/s), dynamic ETA calculation, and transferred byte counter alongside a smooth gradient progress bar.
- **📱 Instant QR Code Pairing**: Generate an instant QR code for mobile devices. Scanning automatically navigates to the session URL with `?c=PIN`, auto-fills the pairing PIN, and connects hands-free.
- **🔒 Security & Gateway Prompts**: Incoming connection prompt lets you preview the remote device model and PIN before accepting or declining.
- **🔋 Screen Wake Lock**: Automatically activates the Screen Wake Lock API during active file transfers so mobile devices don't sleep mid-transfer.
- **📁 Multi-File Queue**: Drag and drop batches of files or select multiple files at once for sequential queue processing.

---

## 🛠️ Architecture & Under the Hood

```
[ Device A (Sender) ]                                  [ Device B (Receiver) ]
         │                                                        │
         ├────── 1. Ephemeral Heartbeat (IP/PIN Presence) ───────┤ (Firestore)
         │                                                        │
         ├────── 2. WebRTC Handshake (STUN / PeerJS) ─────────────┤
         │                                                        │
         ├══════ 3. Direct Encrypted SCTP DataChannel ════════════╡ (P2P Wire)
         │          - 64 KB Slices                                │
         │          - 1 MB Backpressure Buffer Window             │
         │          - Live Speed & ETA Calculation                │
         │                                                        │
         └────── 4. EOF & Automatic Download Assembly ────────────┘
```

1. **Signaling & Presence**: Devices register an ephemeral presence record via Firebase Firestore tagged with a public IP hash and a 5-digit PIN. The live snapshot updates the circular radar in real time.
2. **WebRTC Direct DataChannel**: Peer connections are established directly using Google's public STUN servers. Data is transferred strictly peer-to-peer using DTLS/SCTP encryption—files never hit any intermediate server.
3. **Backpressure Flow Control**: Instead of waiting for round-trip acknowledgments per chunk, WebDrop keeps a 1 MB sliding window in flight and listens to `bufferedamountlow` to avoid buffer bloat while maintaining line rate.

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
- **Firebase Firestore**: Ephemeral device presence and discovery heartbeat
- **Tailwind CSS**: Apple-inspired obsidian glassmorphism UI
- **Phosphor Icons**: Minimalist icon set
- **QRCode.js**: Instant client-side QR generation for smartphone pairing

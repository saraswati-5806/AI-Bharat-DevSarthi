🚀 DevSathi: The Multi-Modal AI Syllabus Engine for MU
"Aapka Personal Academic Mentor, in 22+ Languages."

DevSathi is a next-generation study workspace designed specifically for Mumbai University (MU) students. It transforms static PDFs and YouTube lectures into interactive, high-retention learning experiences using Amazon Bedrock (Nova Lite).

🌟 The Core "Wow" Features
1. 🧠 Senior Mentor Mode (Nova Lite)
Powered by Amazon Nova Lite, DevSathi acts as a Senior Mentor who knows the MU curriculum inside out.

Polyglot Support: Switch between English, Hindi, Marathi, and 20+ other languages mid-conversation.

Syllabus-Aware: It prioritizes your uploaded PDF/Resource context. If it's a Maths PDF, it talks Maths; if it's Programming, it provides Code.

2. 🧪 The Alchemy Lab
One-click transformations of your study material:

[Summary]: High-energy, ELI5 (Explain Like I'm 5) breakdowns.

[Mindmap]: Automated Mermaid.js flowcharts to visualize complex logic.

[Audio]: Instant conversational lecture scripts with built-in TTS (Text-to-Speech) for auditory learners.

3. 💻 Integrated Code Lab (WASM Engine)
A built-in Python environment where students can:

Insert AI-generated code directly from the chat with one click.

Run and test code locally using a WebAssembly (WASM) engine—no setup required.

4. 📂 Smart Resource Viewer
CORS-Bypass Architecture: High-reliability S3 PDF rendering.

YouTube Sync: Watch lectures and chat with the AI about the video content in real-time.

🛠️ Tech Stack
Frontend: Next.js 15 (App Router), Tailwind CSS, Framer Motion.

AI Orchestration: Amazon Bedrock (Model: amazon.nova-lite-v1:0).

Storage: Amazon S3 (Scalable Resource Management).

Deployment: AWS Amplify.

Diagrams: Mermaid.js.

Runtime: Pyodide (Python in the Browser).

🎯 Why DevSathi?
MU students often struggle with complex technical subjects and language barriers. DevSathi bridges this gap by providing:

Language Inclusivity: Learn in your mother tongue.

Contextual Accuracy: No more generic AI hallucinations; it stays strictly on your notes.

Active Learning: Don't just read—visualize, listen, and code.

🚀 How to Run
Clone the repo.

Add your AWS Credentials to .env.local.

Run npm install and npm run dev.

Upload your MU Notes and start learning!

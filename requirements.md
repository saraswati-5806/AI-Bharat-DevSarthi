# 📄 DevSathi: Software Requirements Specification (SRS)

## 1. Project Overview

* **Project Name:** DevSathi
* **Tagline:** "The AI-Powered Vernacular Learning Assistant for Bharat."
* **Vision:** To democratize technical education for Tier-2 and Tier-3 city students by unifying the Textbook, the Teacher, and the Lab into a single, context-aware interface.

## 2. Problem Statement

* **The Language Barrier:** Students understand logic but struggle with English-heavy technical documentation.
* **Context Switching:** Constant switching between PDF notes, video tutorials, and code editors breaks focus and reduces retention.
* **Passive Learning:** Existing platforms are consumption-heavy (video-based); students lack an immediate environment for "Active Experimentation."

## 3. User Personas

* **Rohan (The CS Student):** A vernacular-medium student who knows the logic of loops but struggles with English syntax and setup errors.
* **Priya (The STEM Student):** A Physics major who needs to visualize complex formulas from research papers but finds coding simulations intimidating.

## 4. Technical Stack (Target Architecture)

* **Frontend:**
  * **Framework:** Next.js 14 (App Router) + React.js
  * **Styling:** Tailwind CSS (Modern "Bharat" Theme)
  * **Editor Engine:** Monaco Editor (VS Code core) for the browser-based IDE.
  * **Icons:** Lucide React.

* **AI & Backend:**
  * **Orchestration:** Python FastAPI / AWS Lambda (Serverless).
  * **AI Model:** **AWS Bedrock (Claude 3 Haiku)** – Chosen for low latency and superior vernacular performance.
  * **Embedding Model:** **AWS Titan Embeddings** – For vectorizing PDF content.

* **Data & Storage:**
  * **Document Storage:** **AWS S3** (Secure storage for uploaded PDFs).
  * **Vector Database:** **Knowledge Bases for Amazon Bedrock** (OpenSearch Serverless).
  * **User/Chat Data:** **Amazon DynamoDB** (NoSQL for unstructured chat logs).

## 5. Functional Requirements (The Features)

### FR-01: Domain-Agnostic Context Awareness (RAG)

* **Input:** System accepts PDF documents from any domain (CS, Physics, Math, History).
* **Logic:** The AI must prioritize the uploaded document's context over general knowledge.
* *User Story:* "As a student, I want to upload my specific syllabus notes so the AI teaches me exactly what is required for my exam."

### FR-02: Intelligent Vernacular Localization ("Code-Switching")

* **UI Translation:** The interface (menus, buttons, prompts) switches to the user's selected language (Hindi, Marathi, Tamil, etc.).
* **Syntax Preservation:** Code blocks, keywords (`if`, `print`), and logic must remain in standard English to ensure programming validity.
* **Exam-Compliance Mode:** Technical diagrams and labels within explanations must remain in English to help students prepare for university exams where English terminology is mandatory.
* **Analogical Explanations:** Concepts must be explained using culturally relevant "Daily Life Analogies" (e.g., comparing API to a Waiter).

### FR-03: Adaptive Split-Screen Interface

* **Layout:** A unified 3-column design:
  1. **Left (Resources):** PDF Viewer (React-PDF) with text selection.
  2. **Center (Tutor):** AI Chat Interface.
  3. **Right (The Lab):** Dynamic Workspace.
* **Focus Mode:** Side panels must be collapsible/expandable to allow the user to focus on just the chat or just the code.

### FR-04: Dynamic Workspace ("The Lab")

* **Concept:** The Right Panel changes based on the context.
* **Coding Mode:** Loads Monaco Editor for programming queries.
* **Notes Mode:** Loads a Markdown editor for theoretical queries.
* **Visualization Mode (Future):** Loads graphing tools for Math/Physics.

### FR-05: Hybrid Knowledge Modes

* **General Mode:** Users can query the AI without a file (General Tutor).
* **Context Mode:** Uploading a file automatically restricts the AI to the document's content (Syllabus Tutor).

## 6. Non-Functional Requirements (Quality & Standards)

* **NFR-01 (Performance):** AI responses must be generated in under 3 seconds to maintain a conversational flow.
* **NFR-02 (Accessibility):**
  * **WCAG 2.1 Compliance:** Semantic HTML for screen readers.
  * **Keyboard Navigation:** Full IDE control using keyboard shortcuts.
* **NFR-03 (Scalability):** The system must use Serverless architecture (Lambda/DynamoDB) to handle concurrent users without manual scaling.
* **NFR-04 (Security):** All user data and uploaded files must be encrypted at rest (S3 SSE) and in transit (TLS 1.3).


## 7. Future Scope & Roadmap (Post-Hackathon)

* **Voice-Enabled Assistance:** Integration of Speech-to-Text for users with physical disabilities (Hands-free coding).
* **Offline Mode:** A lightweight PWA version that allows students to access saved notes without active internet.
* **Gamification:** A "Streak" system and "Skill Badges" to motivate consistent learning.
* **Peer-to-Peer Learning:** A community feature where senior students can verify AI answers for juniors.

# 📐 DevSathi: System Design Document (SDD)

## 1. High-Level Architecture

DevSathi follows a **Modern Serverless Microservices Architecture** designed for security, low latency, and scalability. The system is decoupled into three primary layers:

* **Presentation Layer (Frontend):** A responsive Single Page Application (SPA) built with Next.js 14.
* **Orchestration Layer (API):** Next.js API Routes act as a secure "Middleman" to hide API keys and manage session logic before calling AWS services.
* **Intelligence & Data Layer:** Fully managed AWS services for AI inference (Bedrock), Vector Search (OpenSearch Serverless), and NoSQL storage (DynamoDB).

### System Architecture Diagram

```
User Client (Next.js) <--> Next.js API Routes (Secure Gateway) <--> AWS Bedrock (Claude 3)
                                                                        ^
                                                                        |
                                                                 AWS Knowledge Base (RAG)
                                                                        ^
                                                                        |
                                                                    AWS S3 (PDFs)
```

## 2. Frontend Design (UI/UX)

### 2.1. Tech Stack

* **Framework:** Next.js 14 (App Router) for Server-Side Rendering (SSR) and SEO.
* **Styling:** Tailwind CSS.
* **State Management:** Zustand (Lightweight store for Chat History & Editor Content).
* **Core Libraries:**
  * `@monaco-editor/react`: Embeds the VS Code engine for the coding lab.
  * `react-pdf`: Renders high-fidelity textbook pages with text selection.
  * `lucide-react`: For lightweight, consistent iconography.
  * `framer-motion`: Handles smooth layout transitions.

### 2.2. Design System: "Modern Bharat Theme"

The UI follows a "Modern Government + AI" aesthetic, adhering to standard IT sector guidelines for professional applications.

* **Government & IT Standard Compliance:** We utilize a color palette inspired by the **Government of India Web Guidelines (GIGW)**, ensuring the interface looks official, trustworthy, and accessible.
* **Eye Safety Optimization:** The design uses "Soft Matte" colors rather than harsh bright whites. This prevents eye fatigue during long study sessions (3+ hours).
* **High Contrast Modification:** We have specifically modified the standard palette to fix contrast issues (e.g., ensuring text is never white-on-white), guaranteeing 100% readability for students on low-quality screens.

### 2.3. Responsive Layout Strategy

* **Desktop (The "Cockpit"):** A 3-Column Layout for deep work.
  * **Left:** PDF Resource Viewer (Collapsible).
  * **Center:** AI Tutor Chat (Always Visible).
  * **Right:** Dynamic Lab (Code/Notes).

* **Mobile (The "Reviewer"):** A Tab-based Layout.
  * Users switch between "Chat" and "Notes" tabs.
  * **Constraint:** The "Code Editor" is disabled on mobile to prevent poor UX.

## 3. Backend & Database Design

### 3.1. Database Schema (Amazon DynamoDB)

We use a **Single-Table Design** to handle User Data, Chat Logs, and Saved Notes efficiently.

**Table Name:** `DevSathiMain`

* **Partition Key (PK):** `EntityID` (e.g., `USER#123`, `SESSION#456`)
* **Sort Key (SK):** `Metadata` (e.g., `#PROFILE`, `#MSG#TIMESTAMP`)

#### Entity Examples:

**1. User Profile**
```
PK: USER#123
SK: #PROFILE
Attributes: {
  name: "Rohan",
  lang: "Hindi",
  role: "Student"
}
```

**2. Chat Message**
```
PK: SESSION#456
SK: MSG#2026-02-10T10:00:00
Attributes: {
  sender: "user",
  text: "Explain Loops",
  code_snippet: null
}
```

**3. Saved Note**
```
PK: USER#123
SK: NOTE#SESSION#456
Attributes: {
  title: "Physics Ch1 Summary",
  content: "Newton's Laws...",
  date: "2026-02-10"
}
```

### 3.2. RAG Pipeline (The Intelligence Engine)

1. **Ingestion:** User uploads PDF -> Next.js API uploads to S3.
2. **Indexing:** S3 Event triggers AWS Titan Embeddings -> Vectors stored in Knowledge Base for Amazon Bedrock.
3. **Retrieval:** User Query -> Bedrock searches Vector DB -> Retrieves "Top 3 Relevant Chunks".
4. **Generation:** Context + Query sent to Claude 3 Haiku -> AI generates Vernacular Response.

## 4. Data Flow (User Journey)

### Scenario: Student Learning Physics

1. **Upload:** User uploads `Chapter1.pdf`. System indexes it.
2. **Query:** User asks "Explain Velocity" in Hindi.
3. **Retrieval:** System finds the definition on Page 12.
4. **Response:**
   * **Chat:** Explains Velocity using a "Traffic" analogy in Hindi.
   * **PDF Panel:** Automatically scrolls to Page 12 and highlights the definition.
   * **Lab Panel:** Opens "Notes Mode" so the user can save the summary.
5. **Action:** User clicks "Save Note." System writes the summary to DynamoDB.

## 5. Security & Scalability

* **API Security:** All calls to AWS Bedrock are routed through Next.js API Routes, ensuring API keys are never exposed to the client browser.
* **Data Privacy:** User chats are stored in DynamoDB with strict IAM policies. Uploaded PDFs are private in S3.
* **Scalability:**
  * **Frontend:** Deployed on AWS Amplify / Vercel (Global CDN).
  * **Backend:** Serverless (AWS Lambda / Edge Functions) handles traffic spikes during exam season without crashing.

## 6. Implementation Note

**Prototype Disclaimer:** For this hackathon MVP, the application utilizes **Google Gemini 1.5 Flash** as a placeholder for the inference engine to enable rapid local development and testing without incurring immediate cloud costs. The production architecture is fully designed to migrate to **AWS Bedrock (Claude 3)** via the AWS SDK, requiring only an environment variable switch (`AI_PROVIDER=AWS`).

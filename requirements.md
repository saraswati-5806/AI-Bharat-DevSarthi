# 📄 DevSathi: Software Requirements Specification (SRS)

## 1. Project Overview

* **Project Name:** DevSathi
* **Tagline:** "The AI-Powered Multi-Modal Study Workspace for Mumbai University Students."
* **Vision:** To bridge the gap between static study material and active learning by transforming PDFs and YouTube lectures into interactive, polyglot experiences specifically engineered for Mumbai University (MU) students.

## 2. Problem Statement

* **The Language Barrier:** Students understand logic but struggle with English-heavy technical documentation and need support in 22+ Indian languages.
* **Context Switching:** Constant switching between PDF notes, video tutorials, and code editors breaks focus and reduces retention.
* **Passive Learning:** Existing platforms are consumption-heavy (video-based); students lack an immediate environment for "Active Experimentation" with integrated code execution.
* **Resource Fragmentation:** Study materials, code practice, and AI assistance exist in silos, preventing seamless learning workflows.

## 3. User Personas

* **Rohan (The MU CS Student):** A vernacular-medium student who knows the logic of loops but struggles with English syntax and setup errors. Needs instant code execution without environment setup.
* **Priya (The STEM Student):** A Physics major who needs to visualize complex formulas from research papers but finds coding simulations intimidating. Requires mindmaps and audio explanations.
* **Arjun (The Polyglot Learner):** Switches between Hindi, Marathi, and English based on topic complexity. Needs AI that adapts to his language preference dynamically.

## 4. Technical Stack (Final Production Architecture)

* **Frontend:**
  * **Framework:** Next.js 15 (App Router) + React.js
  * **Styling:** Tailwind CSS (Futuristic "Lab" Theme with Glassmorphism)
  * **Editor Engine:** Monaco Editor (VS Code core) for the browser-based IDE
  * **Python Runtime:** Pyodide (WASM) for in-browser Python execution
  * **Visualization:** Mermaid.js for automated mindmap generation
  * **Icons:** Lucide React

* **AI & Backend:**
  * **AI Model:** **Amazon Bedrock (amazon.nova-lite-v1:0)** – Chosen for high-speed, syllabus-aware reasoning and superior vernacular performance
  * **Orchestration:** Next.js API Routes (Serverless)
  * **Context Processing:** Direct resource-to-AI pipeline with strict context adherence

* **Data & Storage:**
  * **Document Storage:** **AWS S3** with Public-Read and CORS '*' configuration for seamless resource rendering
  * **Resource Delivery:** Direct S3-to-Iframe integration bypassing CORS fetch restrictions
  * **Deployment:** **AWS Amplify** for production hosting

## 5. Functional Requirements (The Features)

### FR-01: Senior Mentor Mode (Multi-Language AI Tutor)

* **Input:** System accepts user queries in any of 22+ supported Indian languages (Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, etc.)
* **Logic:** AI acts as a specialized Mumbai University mentor, dynamically switching languages based on user input while maintaining technical accuracy
* **Resource-First Rule:** The AI must strictly stay within the context of the uploaded resource (PDF/YouTube) and never hallucinate information outside the provided material
* *User Story:* "As an MU student, I want to ask questions in my comfortable language and get answers that are grounded in my exact syllabus material."

#### Acceptance Criteria

1. WHEN a user asks a question in Hindi, THE AI SHALL respond in Hindi while preserving English technical terms
2. WHEN a user switches languages mid-conversation, THE AI SHALL adapt immediately without losing context
3. WHEN no resource is uploaded, THE AI SHALL inform the user to upload study material first
4. WHEN the query is outside the resource scope, THE AI SHALL politely redirect to the uploaded content
5. WHEN code examples are needed, THE AI SHALL generate executable Python code with proper syntax

### FR-02: The Alchemy Lab (Automated Multi-Modal Content Generation)

* **Concept:** One-click transformation of uploaded resources into multiple learning formats
* **Outputs:**
  1. **Summary:** Concise, bullet-point summary of the entire resource
  2. **Mindmap:** Mermaid.js-based visual knowledge graph showing concept relationships
  3. **Audio Script:** Lecture-style narration script optimized for text-to-speech conversion
* **Trigger:** Automatic generation upon resource upload completion
* *User Story:* "As a student, I want my 50-page PDF to be instantly converted into a summary, mindmap, and audio script so I can study in multiple formats."

#### Acceptance Criteria

1. WHEN a PDF is uploaded, THE Alchemy Lab SHALL generate all three outputs within 30 seconds
2. WHEN a YouTube link is provided, THE Alchemy Lab SHALL extract transcript and generate outputs
3. WHEN generation fails, THE system SHALL provide clear error messages and retry options
4. WHEN outputs are ready, THE system SHALL display them in dedicated tabs within the Resource Viewer
5. WHEN the mindmap is generated, THE system SHALL render it using Mermaid.js with proper formatting

### FR-03: Resource-Sync Architecture (Triple-Column Workspace)

* **Layout:** A unified 3-column design with synchronized state:
  1. **Left (Resource Viewer):** PDF/YouTube viewer with Alchemy Lab outputs (Summary, Mindmap, Audio)
  2. **Center (Companion AI):** Senior Mentor chat interface with resource-aware responses
  3. **Right (Code Lab):** Monaco Editor with Pyodide runtime for instant Python execution
* **State Synchronization:** All panels share context - code generated by AI can be inserted into Code Lab with one click
* **Mode Switching:** Users can toggle between Theory Mode (Resource + AI), Hybrid Mode (All 3), and Build Mode (Code + AI)
* *User Story:* "As a student, I want to read my notes, ask AI questions, and test code examples without switching applications."

#### Acceptance Criteria

1. WHEN AI generates code, THE "Insert Code" button SHALL appear and populate the Code Lab
2. WHEN a user switches modes, THE layout SHALL adapt smoothly with animated transitions
3. WHEN a resource is uploaded, THE context SHALL be available to both AI and Code Lab
4. WHEN code is executed, THE output SHALL display in the Code Lab terminal
5. WHEN panels are resized, THE layout SHALL maintain responsive behavior

### FR-04: Bulletproof PDF Rendering (Direct S3 Integration)

* **Architecture:** Direct S3-to-Iframe integration bypassing CORS fetch restrictions
* **Configuration:** S3 bucket with Public-Read access and CORS '*' policy
* **Reliability:** Eliminates blob fetch errors and hydration issues
* *User Story:* "As a student, I want my uploaded PDFs to render instantly without CORS errors or loading failures."

#### Acceptance Criteria

1. WHEN a PDF is uploaded to S3, THE system SHALL generate a public URL
2. WHEN the PDF URL is embedded in iframe, THE document SHALL render without CORS errors
3. WHEN the page reloads, THE PDF SHALL persist without re-upload
4. WHEN the PDF fails to load, THE system SHALL display a clear error message with retry option
5. WHEN multiple PDFs are uploaded, THE system SHALL manage them in a resource library

### FR-05: Interactive Code Lab (WASM-Based Python Execution)

* **Runtime:** Pyodide (Python in WebAssembly) for zero-latency, client-side execution
* **Features:**
  * Monaco Editor with Python syntax highlighting
  * Instant code execution without server calls
  * AI-generated code insertion with one-click
  * Output console with error handling
* *User Story:* "As a student, I want to test Python code examples from my notes immediately without installing anything."

#### Acceptance Criteria

1. WHEN a user writes Python code, THE Monaco Editor SHALL provide syntax highlighting and autocomplete
2. WHEN the "Run" button is clicked, THE code SHALL execute in Pyodide and display output within 2 seconds
3. WHEN AI generates code, THE "Insert Code" button SHALL populate the editor
4. WHEN code has errors, THE console SHALL display clear error messages with line numbers
5. WHEN code execution takes too long, THE system SHALL provide a timeout warning

### FR-06: Intelligent UI/UX Design ("Lab" Aesthetic)

* **Design System:** Futuristic dark theme with glassmorphism effects
* **Visual Elements:**
  * Rounded corners (2.5rem border-radius)
  * Semi-transparent panels with backdrop blur
  * Neon accent colors for active states
  * Smooth transitions and animations
* **Accessibility:** High contrast text, keyboard navigation, screen reader support
* *User Story:* "As a student, I want a modern, visually appealing interface that makes studying feel engaging and professional."

#### Acceptance Criteria

1. WHEN the application loads, THE UI SHALL display the dark "Lab" theme with glassmorphism
2. WHEN panels are active, THE borders SHALL glow with neon accents
3. WHEN users interact with elements, THE transitions SHALL be smooth (300ms)
4. WHEN text is displayed, THE contrast SHALL meet WCAG 2.1 AA standards
5. WHEN keyboard navigation is used, THE focus states SHALL be clearly visible

### FR-07: Markdown Rendering Fix (Hydration Error Resolution)

* **Issue:** React hydration errors caused by <p> tags inside <div> tags
* **Solution:** Custom Markdown renderer mapping <p> tags to <div> tags
* **Impact:** Eliminates console errors and ensures stable rendering
* *Technical Requirement:* "The system must render Markdown content without React hydration warnings."

#### Acceptance Criteria

1. WHEN Markdown content is rendered, THE system SHALL use <div> tags instead of <p> tags
2. WHEN the page hydrates, THE console SHALL show no hydration errors
3. WHEN Markdown includes code blocks, THE syntax highlighting SHALL work correctly
4. WHEN Markdown includes lists, THE formatting SHALL be preserved
5. WHEN Markdown includes links, THE links SHALL be clickable and styled appropriately

## 6. Non-Functional Requirements (Quality & Standards)

* **NFR-01 (Performance):** 
  * AI responses must be generated in under 3 seconds using Amazon Bedrock Nova Lite
  * PDF rendering must complete within 2 seconds using direct S3 iframe integration
  * Code execution in Pyodide must complete within 2 seconds for simple programs
  * Alchemy Lab outputs must generate within 30 seconds

* **NFR-02 (Accessibility):**
  * **WCAG 2.1 AA Compliance:** High contrast text on dark backgrounds
  * **Keyboard Navigation:** Full workspace control using keyboard shortcuts
  * **Screen Reader Support:** Semantic HTML with proper ARIA labels

* **NFR-03 (Scalability):** 
  * Serverless architecture (Next.js API Routes + AWS Amplify) handles concurrent users without manual scaling
  * S3 with CloudFront CDN ensures fast resource delivery globally
  * Client-side code execution (Pyodide) eliminates server load

* **NFR-04 (Security):** 
  * S3 bucket configured with Public-Read for resources but no write access
  * API keys secured in environment variables, never exposed to client
  * CORS policy configured to allow only authorized domains in production

* **NFR-05 (Reliability):**
  * Direct S3 iframe integration eliminates CORS fetch failures
  * Hydration error fix ensures stable React rendering
  * Error boundaries catch and display user-friendly error messages

## 7. Future Scope & Roadmap (Post-Deployment)

* **Voice-Enabled Assistance:** Integration of Speech-to-Text for users with physical disabilities (Hands-free coding)
* **Offline Mode:** Progressive Web App (PWA) version with cached resources for offline study
* **Gamification:** Streak system and skill badges to motivate consistent learning
* **Peer-to-Peer Learning:** Community feature where senior students can verify AI answers for juniors
* **Advanced Alchemy:** Video summarization, quiz generation, and flashcard creation
* **Mobile App:** Native iOS/Android apps with optimized touch interfaces
* **Collaborative Study:** Real-time multi-user workspaces for group study sessions

## 8. Success Metrics

* **User Engagement:** Average session duration > 30 minutes
* **AI Accuracy:** 95%+ user satisfaction with resource-grounded responses
* **Performance:** 99% uptime on AWS Amplify
* **Adoption:** 1000+ active MU students within first semester
* **Code Execution:** 90%+ success rate for AI-generated code snippets

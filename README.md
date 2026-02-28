SediaBanjir
Flood Preparedness Assistant

SediaBanjir is a web based flood preparedness platform designed to help Malaysian communities better understand flood risks and take early preventive action. Flooding remains one of the most disruptive natural disasters in Malaysia, affecting homes, infrastructure, and livelihoods every year. This platform transforms technical flood related information into structured, understandable, and actionable guidance for individuals and families.

Problem Statement
Malaysia experiences recurring floods, especially during monsoon seasons. While official alerts provide general warnings, they often lack localized interpretation and practical preparedness guidance. Many communities struggle to translate raw data such as water levels or rainfall intensity into meaningful safety decisions.
SediaBanjir addresses this gap by combining structured risk logic with AI generated advisory insights to provide clearer, location based flood preparedness information.

Key Features
Google Sign In authentication using Firebase
Location based flood risk checking
Risk classification logic based on structured input
AI generated flood preparedness advisory using Google Gemini
Dynamic and context aware safety recommendations
Modular frontend and backend architecture

Technology Stack
Frontend
React with Vite
TypeScript
Deployed on Vercel
Firebase Authentication for user management

Backend
Node.js API
Deployed on Render
Secure Gemini API integration

Google Technologies
Firebase Authentication
Google AI Studio
Gemini API

System Architecture Overview
User accesses the web application deployed on Vercel.
User signs in securely using Firebase Authentication.
User selects location through the frontend interface.
Frontend sends structured API request to the backend.
Backend validates input and constructs a structured prompt.
Backend communicates with Gemini API via Google AI Studio.
Gemini generates context aware flood risk insights and preparedness advice.
Backend formats the AI response and sends it back to the frontend.
Frontend displays risk level and recommended safety measures.
This modular separation ensures security, scalability, and maintainability.

AI Integration
SediaBanjir integrates Google Gemini through Google AI Studio to generate dynamic flood preparedness guidance. Instead of relying on static messages, the system produces context based recommendations tailored to user selected locations.

AI generated outputs include:
Flood risk level explanation
Recommended safety precautions
Preparation checklist guidance
This enables adaptive advisory rather than fixed predefined responses.

Challenges Faced
Frontend and Backend Integration
Initial API mismatches caused communication failures. We standardized request and response structures and implemented consistent asynchronous handling to ensure stable integration.

Gemini API Debugging
AI responses were inconsistent during early testing. We refined prompt structure and improved response formatting to ensure reliable output generation.

Technology Constraints
Due to billing considerations, we explored alternative mapping tools and deployment configurations to maintain scalability while minimizing cost.

Learning Curve
As a team new to full stack development, we invested time in research, debugging, and iterative testing to strengthen implementation quality.

Scalability and Future Roadmap
The system uses a modular design that allows independent scaling of frontend traffic and backend processing.

Planned Improvements
Automated real time data synchronization
Push notification alerts for high risk events
Improved visual risk indicators
Enhanced backend security and rate limiting
Expanded geographic coverage

Alignment with Sustainable Development Goals
SediaBanjir supports:
SDG 11: Sustainable Cities and Communities
By improving disaster preparedness and resilience.
SDG 13: Climate Action
By leveraging predictive technology to mitigate the impact of climate related flood events.

Author
Student project developed as part of a Google Developer submission.

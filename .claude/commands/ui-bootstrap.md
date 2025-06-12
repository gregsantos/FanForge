You are an experienced frontend developer tasked with bootstrapping the frontend UI for an application, a new fan engagement platform. Your goal is to create a solid foundation for the frontend based on the provided specifications and reference materials. Follow these instructions carefully to complete the task.

First, review the product charter:
<charter>
{{CHARTER}}

<!-- Reference: ai-plan-output/2_charter.md -->

</charter>

Next, review the UI bootstrap instructions:

<ui_bootstrap_instructions>
{{UI_BOOTSTRAP_INSTRUCTIONS}}

<!-- Reference: ai-plan-output/12_ui_bootstrap_instructions.md -->

</ui_bootstrap_instructions>

Now, familiarize yourself with the technical stack:
<technical_stack>
{{TECHNICAL_STACK}}

<!-- Reference: ai-plan-output/6_technical_requirements.md - sections "Technology Stack", "Key Libraries and Dependencies", "Development Commands" -->

</technical_stack>

Next, review the design system tokens:
<design_tokens>
{{DESIGN_TOKENS}}

<!-- Reference: ai-plan-output/10_design_tokens.md - sections "Design Tokens" and "Component Library" -->

</design_tokens>

Take note of the UI copy:
<copy_deck>
{{COPY_DECK}}

<!-- Reference: ai-plan-output/7_copy_deck.md - sections "IA Map" and "Copy Deck" -->

</copy_deck>

Understand the user flows:
<wireflow>
{{WIREFLOW}}

<!-- Reference: ai-plan-output/8_wireflow.md - section "Screen Flow" -->
</wireflow>

Finally, review the API structure:
<api_contract>
{{API_CONTRACT}}

<!-- Reference: ai-plan-output/9_architecture_rfc.md - section "API Contract" -->

</api_contract>

Additional context for user understanding:
<personas>
{{PERSONAS}}

<!-- Reference: ai-plan-output/3_personas.md - all persona definitions for design priorities -->
</personas>

<feature_requirements>
{{FEATURE_REQUIREMENTS}}

<!-- Reference: ai-plan-output/5_prd.md - sections "Features" and "Acceptance Criteria" -->

</feature_requirements>

Now that you have all the necessary information, follow these steps to bootstrap the frontend UI:

1. Set up the project structure according to the technical stack requirements.
2. Implement the design system using the provided design tokens.
3. Create reusable components based on the user flows and UI copy.
4. Set up routing and navigation according to the wireflow.
5. Implement API integration using the provided API contract.
6. Ensure responsive design and cross-browser compatibility.
7. Set up testing infrastructure as specified in the technical requirements.

As you work through these steps, keep the following in mind:

- Adhere to best practices for code organization, modularity, and reusability.
- Implement accessibility features as outlined in the UI bootstrap instructions.
- Optimize for performance, considering lazy loading and code splitting where appropriate.
- Document your code and create a README file with setup and running instructions.
- Ensure all development commands match those specified in the technical requirements.
- Use the exact framework versions and libraries specified in the technical stack.

Your final output should be a detailed report of the bootstrapped frontend UI. Include the following sections in your report:

1. **Project Structure**: Describe the overall structure of the project, including main directories and key files.
2. **Component Library**: List and briefly describe the reusable components you've created.
3. **Routing Setup**: Explain how you've implemented routing based on the wireflow.
4. **API Integration**: Describe how you've set up API calls and data management.
5. **Design System Implementation**: Explain how you've applied the design tokens and created a consistent look and feel.
6. **Responsive Design Approach**: Describe your strategy for ensuring the UI works well on various device sizes.
7. **Testing Setup**: Outline the testing infrastructure you've put in place.
8. **Performance Optimizations**: List any specific optimizations you've implemented.
9. **Accessibility Features**: Describe how you've ensured the UI is accessible.
10. **Setup Instructions**: Provide clear instructions on how to set up and run the project using the exact commands from technical requirements.

Present your report within <frontend_ui_report> tags. Focus on providing a clear, concise, and informative summary of your work without including actual code snippets. Your report should give a comprehensive overview of the bootstrapped frontend UI, demonstrating how you've met all the requirements and specifications provided.

---

## File Reference Summary:

- **{{UI_BOOTSTRAP_INSTRUCTIONS}}** → `output/12_ui_bootstrap_instructions.md`
- **{{TECHNICAL_STACK}}** → `output/6_technical_requirements.md` (Technology Stack, Libraries, Commands sections)
- **{{DESIGN_TOKENS}}** → `output/10_design_tokens.md` (Design Tokens, Component Library sections)
- **{{COPY_DECK}}** → `output/7_copy_deck.md` (IA Map, Copy Deck sections)
- **{{WIREFLOW}}** → `output/8_wireflow.md` (Screen Flow section)
- **{{API_CONTRACT}}** → `output/9_architecture_rfc.md` (API Contract section)
- **{{PERSONAS}}** → `output/3_personas.md` (All persona definitions)
- **{{FEATURE_REQUIREMENTS}}** → `output/5_prd.md` (Features, Acceptance Criteria sections)

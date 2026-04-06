# Implementation Instruction

> **This document is the ONLY specification for the feature.**  
> The AI must implement **strictly** according to this instruction and repository-wide rules  
>
> **Forbidden actions**
> - Adding new features not described here  
> - Guessing or assuming unspecified behavior  
> - Refactoring unrelated code  
> - Changing data structures unless explicitly stated  
> - UI redesign  
> - Modifying any logic or files outside the defined scope 

---

## 1. Overview
> A concise 2–4 sentence description summarizing the feature based on the seed.  
> Must describe:
> - The problem this feature solves  
> - The purpose  
> - High-level behavior  
> - Whether it extends or interacts with an existing feature  

---

## 2. Scope

## 2.1 In Scope (MUST implement)

> A complete list of implementation tasks derived from the seed requirements.  
> This becomes the **only** set of tasks the AI is allowed to implement.

- [ ] Feature A: …  
- [ ] UI component(s): …  
- [ ] API or logic additions: …  
- [ ] CSV/DB operations: …  
- [ ] State updates / side effects: …  

## 2.2 Out of Scope (MUST NOT implement)

> Clearly lists everything that should NOT be included to prevent scope creep.

- No refactoring of unrelated code  
- No renaming existing identifiers  
- No changes to UI beyond what is defined in In Scope  
- No new endpoints or data models not explicitly listed  
- No design or layout overhaul  
- No performance optimization unless required  
- No modification of files not listed in Section 3  

---

# 3. Affected Files & Locations

> The AI may only create or modify files listed here.  
> All other files are strictly off-limits.

## 3.1 New Files
- `path/to/newFile.tsx`: purpose  
- `logic/.../newLogic.ts`: purpose  

## 3.2 Modified Files
- `src/.../ExistingComponent.tsx`: what will be changed and why  
- `logic/.../existingLogic.ts`: what will be changed and why  

## 3.3 Reference Only (MUST NOT modify)
- `AGENTS.md`  

- Other related reference files  


---

# 4. Data Structures & Models

> All relevant data definitions must be explicitly stated here.  
> The AI must **not** add, remove, or alter fields unless stated in this section.

## 4.1 TypeScript Interfaces / Types

```ts
// Example — replace with actual structures for this feature
export interface Example {
  id: string;       // UUID
  name: string;     // Non-empty
  status: "active" | "inactive";
}
```

## 4.2 CSV / Database Schema

If this feature interacts with CSV:

- **Target file:** `db/<filename>.csv`
- **Column order (MUST NOT change):**
  1. `id`
  2. `name`
  3. `status`

**Constraints:**

- `id` must be unique  
- `name` must not be empty  
- `status` must match the defined enum values  
- CSV write operations must **preserve header and column order**  
- Only one atomic write is allowed (`read → modify → write`)  

If this feature interacts with a database instead, specify:

- Table name  
- Columns with types  
- Primary keys  
- Unique constraints  
- Foreign keys  
- Default values  
- Nullable / non-nullable rules  



---

# 5. Logic Specification

## 5.1 Inputs

List all inputs the logic receives:

- UI form values  
- Route parameters  
- API request bodies  
- Existing CSV/DB data  
- Component props  
- Function arguments  

Example:

- `{ name: string; status: "active" | "inactive" }`  
- URL parameter: `id: string`  
- CSV rows loaded from `db/example.csv`  


## 5.2 Processing Flow (Strict Order)

> The AI must follow this exact sequence.  
> Reordering, merging, or skipping steps is forbidden.

1. Validate input  
2. Load existing CSV/DB records  
3. Validate domain constraints (e.g., duplicates, required fields)  
4. Construct the new or updated record  
5. Perform one atomic write to CSV/DB  
6. Return a structured `Result<T>`  


## 5.3 Outputs

The feature must produce:

- A `Result<T>` object  
- The updated or newly created record  
- Any necessary UI state updates  
- Updated CSV/DB contents where applicable  


## 5.4 Error Handling

All errors must follow the project’s unified `Result<T>` pattern.

Expected error types:

- `VALIDATION_ERROR`  
- `DUPLICATE_NAME`  
- `NOT_FOUND`  
- `IO_ERROR`  

UI handling rules:

- Validation errors → Keep modal/dialog open, show message  
- IO errors → Preserve input, show generic message  
- Must NOT auto-close on error  

---

# 6. UI Specification (If applicable)

## 6.1 Component Structure

Define:

- Component name  
- Props  
- Internal state  
- How the component interacts with logic  

Example of props:

- `open: boolean`  
- `onClose: () => void`  
- `onSuccess: (record: Example) => void`  

Internal state examples:

- `name`  
- `status`  
- `isSubmitting`  


## 6.2 Layout & Behavior

Describe:

- Required form fields  
- Input validation behavior  
- Button behavior (primary / secondary)  
- Disabled/Loading states  
- Modal/dialog open/close rules  
- What happens after success  
- What happens after errors  
- Navigation behavior (if any)  


## 6.3 Translations

All UI text must use translation keys.  
**Hard-coded text is strictly forbidden.**

Examples:

ui.example.title
ui.example.form.name
ui.common.save
ui.common.cancel
error.example.duplicateName

---

# 7. Edge Cases & Constraints

The implementation must handle:

- Empty or whitespace-only input  
- Duplicate names (case-insensitive)  
- Missing CSV → create file with header  
- Corrupted CSV → return IO error  
- Large CSV files → avoid O(N²) logic  
- Atomic write requirements (read → modify → write)  
- Invalid or missing IDs  
- Unexpected null/undefined values  
- UI interactions while loading (disable buttons)  

---

# 8. Acceptance Criteria (Definition of Done)

The feature is considered complete only if:

- All items in **Section 2.1 (In Scope)** are fully implemented  
- No scope creep: nothing outside In Scope is added  
- Only files listed in **Section 3** were modified  
- All data structures match **Section 4** exactly  
- Logic follows **Section 5** step-by-step  
- UI matches **Section 6**  
- All edge cases in **Section 7** handled  
- Code follows:
  - AGENTS.md rules  
  - Conventions.md  
  - TypeScript strict mode (no `any`)  
  - CSV & Result patterns  
- No lint errors  
- No unused variables or dead code  
- No TODOs remaining  
- No hard-coded text (must use translation keys)  

---

# 9. Questions / Ambiguities

> If any part of the seed is incomplete, unclear, or conflicting,  
> AI must list the questions here instead of making assumptions.  
> Implementation must NOT begin until all questions are resolved.

- [ ] Question 1  
- [ ] Question 2  
- [ ] Missing data definition  
- [ ] Ambiguous UI behavior  
- [ ] Unclear constraints  



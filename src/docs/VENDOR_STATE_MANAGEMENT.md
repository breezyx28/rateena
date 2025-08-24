# Vendor State Management

This document explains the different approaches to handle vendor states without implementing the same logic repeatedly across different components.

## Problem

Previously, vendor state management logic was duplicated across multiple components:

- Redux selectors
- State management
- API calls
- Error handling
- Toast notifications
- Image upload handlers

## Solutions

### 1. Custom Hook Approach (Recommended)

**File:** `src/hooks/useVendorState.ts`

This approach encapsulates all vendor state logic in a reusable custom hook.

#### Usage:

```tsx
import { useVendorState } from "../../hooks";

const VendorProfile = () => {
  const {
    vendorInfo,
    selectedCoords,
    setSelectedCoords,
    toggleVendorStatus,
    handleProfileImageUpload,
    handleCoverImageUpload,
    getCurrentVendorStatus,
    getCurrentVendorStatusText,
  } = useVendorState({
    vendorId: vendorId || "",
    initialVendorInfo: location.state ?? {},
  });

  // Use the state and functions directly
  return (
    <div>
      <h1>{vendorInfo?.fullName}</h1>
      <button onClick={() => toggleVendorStatus(vendorId, vendorInfo?.working)}>
        Toggle Status
      </button>
    </div>
  );
};
```

#### Benefits:

- ✅ Reusable across components
- ✅ Encapsulates all vendor logic
- ✅ Easy to test
- ✅ No prop drilling
- ✅ Type-safe

### 2. Context Approach (Alternative)

**File:** `src/contexts/VendorContext.tsx`

This approach uses React Context to share vendor state across a component tree.

#### Usage:

```tsx
// Wrap your component tree
<VendorProvider vendorId={vendorId} initialVendorInfo={initialData}>
  <VendorProfile />
</VendorProvider>;

// Use in any child component
const SomeChildComponent = () => {
  const { vendorInfo, toggleVendorStatus } = useVendorContext();

  return (
    <div>
      <h1>{vendorInfo?.fullName}</h1>
    </div>
  );
};
```

#### Benefits:

- ✅ No prop drilling
- ✅ Shared state across component tree
- ✅ Good for complex component hierarchies

#### Drawbacks:

- ❌ More complex setup
- ❌ Overkill for simple use cases
- ❌ Harder to test

## Implementation Details

### Custom Hook Features

The `useVendorState` hook provides:

#### State Management:

- `vendorInfo`: Current vendor data
- `vendorState`: Toggle state management
- `selectedCoords`: Map coordinates
- `vendorError`: Error state
- `vendorData`: Raw Redux data

#### Actions:

- `toggleVendorStatus()`: Toggle vendor working status
- `handleProfileImageUpload()`: Upload profile image
- `handleCoverImageUpload()`: Upload cover image
- `dispatch`: Redux dispatch for custom actions

#### Computed Values:

- `getCurrentVendorStatus()`: Get current vendor status
- `getCurrentVendorStatusText()`: Get status text ("Active"/"Inactive")

#### Setters:

- `setVendorInfo()`: Update vendor info
- `setSelectedCoords()`: Update map coordinates

### Redux Integration

The hook automatically:

- Fetches vendor data on mount
- Updates local state when Redux data changes
- Handles errors and resets state
- Manages loading states

### Error Handling

- Automatic error logging
- State reset on errors
- User-friendly toast notifications
- Graceful fallbacks

## Migration Guide

### From Duplicated Logic to Custom Hook

**Before:**

```tsx
const VendorProfile = () => {
  const dispatch = useDispatch();
  const [vendorInfo, setVendorInfo] = useState({});
  const [vendorState, setVendorState] = useState({});

  // 50+ lines of duplicated logic...

  const toggleVendorStatus = (vendorId, currentStatus) => {
    // Duplicated logic...
  };

  const handleProfileImageUpload = (event) => {
    // Duplicated logic...
  };

  // More duplicated logic...
};
```

**After:**

```tsx
const VendorProfile = () => {
  const { vendorInfo, toggleVendorStatus, handleProfileImageUpload } =
    useVendorState({
      vendorId: vendorId || "",
      initialVendorInfo: location.state ?? {},
    });

  // Clean, focused component logic
};
```

## Best Practices

1. **Use Custom Hook for Simple Cases**: When you need vendor state in a few components
2. **Use Context for Complex Trees**: When many nested components need vendor state
3. **Keep Components Focused**: Components should focus on UI, not state management
4. **Test Hooks Separately**: Test the custom hook logic independently
5. **Type Everything**: Use TypeScript interfaces for all state and props

## Examples

### Using in Tab Components

```tsx
// PersonalDetailsTab.tsx
const PersonalDetailsTab = ({
  vendorInfo,
  vendorId,
  selectedCoords,
  setSelectedCoords,
}) => {
  // Component logic here
};

// Main component
const VendorProfile = () => {
  const { vendorInfo, selectedCoords, setSelectedCoords } = useVendorState({
    vendorId: vendorId || "",
  });

  return (
    <PersonalDetailsTab
      vendorInfo={vendorInfo}
      vendorId={vendorId}
      selectedCoords={selectedCoords}
      setSelectedCoords={setSelectedCoords}
    />
  );
};
```

### Using Context in Tab Components

```tsx
// PersonalDetailsTabWithContext.tsx
const PersonalDetailsTabWithContext = () => {
  const { vendorInfo, selectedCoords, setSelectedCoords } = useVendorContext();

  // Component logic here - no props needed!
};

// Main component with provider
const VendorProfile = () => {
  return (
    <VendorProvider vendorId={vendorId} initialVendorInfo={initialData}>
      <PersonalDetailsTabWithContext />
    </VendorProvider>
  );
};
```

## Conclusion

The custom hook approach (`useVendorState`) is recommended for most use cases as it:

- Eliminates code duplication
- Provides a clean, reusable interface
- Maintains good performance
- Is easy to test and maintain

Use the context approach only when you have deeply nested components that all need access to vendor state.

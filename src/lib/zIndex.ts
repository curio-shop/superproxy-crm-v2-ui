/**
 * Centralized Z-Index System
 *
 * This file defines the z-index hierarchy for all UI elements in the application.
 * Always use these constants to ensure proper layering and prevent conflicts.
 *
 * Hierarchy (from bottom to top):
 * 1. Base content and pages (10)
 * 2. Sidebar (20)
 * 3. Header (30)
 * 4. Sidebar tooltips (35) - visible above content, below dropdowns
 * 5. MinimizedCallsBar (40)
 * 6. Floating chat button (45)
 * 7. Dropdowns, menus, and popovers (50)
 * 8. Celebration effects (confetti, paper fly) (60)
 * 9. Drawers (side panels) (100)
 * 10. Chat dialog (150)
 * 11. Regular modals (200)
 * 12. Presentation viewer (250)
 * 13. Critical modals (1000) - PostCall, EndCall, etc.
 */

export const zIndex = {
  // Base layer
  base: 10,

  // Navigation
  sidebar: 20,
  header: 30,
  sidebarTooltip: 35,
  minimizedCalls: 40,
  floatingChatButton: 45,

  // Overlays
  dropdown: 50,
  menu: 50,
  popover: 50,

  // Effects
  celebration: 60,

  // Panels
  drawer: 100,
  chatDialog: 150,

  // Modals
  modal: 200,
  presentationViewer: 250,
  criticalModal: 1000,
} as const;

// Helper function to get z-index class
export const getZIndexClass = (layer: keyof typeof zIndex): string => {
  const value = zIndex[layer];
  return `z-[${value}]`;
};

export const Z_INDEX = zIndex;

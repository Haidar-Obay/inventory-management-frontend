# Scheduler Component

A modular, feature-rich scheduler component built with React and Tailwind CSS.

## 🏗️ Architecture

The scheduler has been refactored into a clean, modular structure:

```
components/ui/scheduler/
├── Scheduler.jsx              # Main component (now only ~150 lines!)
├── EventDialog.jsx            # Event creation/editing modal
├── DayEventsModal.jsx         # Day events display modal
├── components/                 # View components
│   ├── SchedulerHeader.jsx    # Header with navigation & filters
│   ├── WeekView.jsx           # Week calendar grid
│   ├── DayView.jsx            # Single day timeline
│   ├── MonthView.jsx          # Month calendar grid
│   ├── EventRenderer.jsx      # Reusable event display
│   ├── NoEventsFound.jsx      # No events message
│   └── index.js               # Component exports
├── hooks/                      # Custom hooks
│   ├── useSchedulerState.js   # All state management
│   ├── useEventHandlers.js    # Event CRUD operations
│   ├── useDateNavigation.js   # Date navigation logic
│   ├── useEventFiltering.js   # Search and filter logic
│   └── index.js               # Hook exports
├── utils/                      # Utility functions
│   ├── dateUtils.js           # Date calculations
│   ├── eventUtils.js          # Event overlap detection
│   └── index.js               # Utility exports
└── README.md                   # This file
```

## ✨ Features

- **Multiple Views**: Week, Day, and Month views
- **Event Management**: Create, edit, and delete events
- **Smart Overlap Handling**: Events stack horizontally when overlapping
- **Search & Filtering**: Search by title, filter by date and color
- **Responsive Design**: Works on all screen sizes
- **Now Indicator**: Red line showing current time
- **Auto-scroll**: Automatically scrolls to current time
- **Event Modals**: Click events to edit, click time slots to create

## 🎯 Benefits of Refactoring

### **Before (956 lines):**
- Single massive component
- Hard to maintain and debug
- Difficult to test individual parts
- Mixed concerns (state, logic, UI)

### **After (~150 lines main component):**
- **Modular components** - Each view is separate
- **Custom hooks** - Logic separated from UI
- **Utility functions** - Reusable date/event logic
- **Easy testing** - Test components independently
- **Better maintainability** - Changes isolated to specific files
- **Reusability** - Components can be used elsewhere

## 🔧 Usage

```jsx
import Scheduler from './components/ui/scheduler/Scheduler';

function App() {
  return (
    <div className="h-screen">
      <Scheduler />
    </div>
  );
}
```

## 🚀 Customization

### Adding New Views
1. Create component in `components/` folder
2. Add to `components/index.js`
3. Import and use in main `Scheduler.jsx`

### Adding New Features
1. Create custom hook in `hooks/` folder
2. Add utility functions in `utils/` folder
3. Import and use in main component

### Styling
- Uses Tailwind CSS classes
- Consistent design system
- Easy to customize colors and spacing

## 📱 Responsive Design

- **Mobile**: Stacked layout, touch-friendly
- **Tablet**: Optimized grid layouts
- **Desktop**: Full-featured with all controls

## 🎨 Event Styling

Events automatically:
- Stack horizontally when overlapping
- Show different content based on height
- Include hover effects and transitions
- Display time information when space allows

## 🔍 Search & Filtering

- **Search**: Real-time search by event title
- **Date Filter**: Filter events by specific date
- **Color Filter**: Filter by event color
- **Active Filters**: Visual indicators with easy removal

## 📅 Navigation

- **Previous/Next**: Navigate between periods
- **Today**: Jump to current date
- **View Toggle**: Switch between week/day/month
- **Auto-scroll**: Automatically scrolls to current time

## 🧪 Testing

Each component can be tested independently:

```jsx
import { render, screen } from '@testing-library/react';
import { SchedulerHeader } from './components';

test('SchedulerHeader renders navigation buttons', () => {
  render(<SchedulerHeader {...mockProps} />);
  expect(screen.getByText('Today')).toBeInTheDocument();
});
```

## 🔮 Future Enhancements

- **Recurring Events**: Weekly/monthly repeating events
- **All-day Events**: Events spanning multiple days
- **Drag & Drop**: Move events between time slots
- **Resize Events**: Change event duration by dragging
- **Calendar Integration**: Sync with external calendars
- **Data Persistence**: Save events to backend/database

## 🐛 Troubleshooting

### Common Issues:
1. **Events not showing**: Check if filters are active
2. **Modal not appearing**: Verify z-index and positioning
3. **Performance issues**: Check for unnecessary re-renders

### Debug Mode:
Add `console.log` statements in custom hooks to debug state changes.

## 📚 Dependencies

- React 18+
- Tailwind CSS
- Custom UI components (Button, Card, etc.)

## 🤝 Contributing

When adding new features:
1. Follow the modular structure
2. Create custom hooks for logic
3. Keep components focused and small
4. Add proper TypeScript types (if using TS)
5. Update this README

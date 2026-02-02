# Restaurant Details Page - 10x Designer Audit

![Current State](/home/dbhaila/.gemini/antigravity/brain/936a2f87-8049-4144-9f02-e6942016688e/uploaded_media_1769999099609.png)

---

## ✅ What's Working

| Element | Why It's Good |
|---------|---------------|
| **Gradient fallback** | Maintains visual identity when no image. Matches discovery cards. |
| **Floating header card** | Creates depth, draws focus to restaurant name. |
| **Yellow rating badge** | High contrast, instantly scannable. |
| **Collapsible hours** | Reduces cognitive load, progressive disclosure. |
| **Sticky action bar** | Primary actions always accessible. |

---

## ⚠️ What Needs Improvement

### Visual Design

| Issue | Impact | Fix |
|-------|--------|-----|
| **Large empty space** | Page feels sparse below Location. Needs more content or tighter spacing. | Add "What People Say" placeholder or reduce bottom padding. |
| **N logo in action bar** | Feels like a glitch/placeholder. What is it? | Remove or replace with actual brand icon. |
| **Back button styling** | Semi-transparent might be hard to see on some hero images. | Increase contrast or add subtle shadow. |
| **Location card style** | Gray box looks dated. Doesn't match the premium glass effect above. | Apply glassmorphism or use borderless design. |

### Transitions & Motion

| Current State | Problem | Native Feel |
|---------------|---------|-------------|
| **Page fade-in (500ms)** | Feels slow, not "snappy" | Reduce to 200-300ms or use slide-in. |
| **No shared element** | Hero doesn't connect to card tap. Feels like a page reload. | Hero image should "expand" from card position. |
| **Mixed animation systems** | Framer Motion in BottomNav/Swipe, CSS in Details. Inconsistent timing. | Standardize on one system (recommend CSS for simplicity). |

---

## 🚀 Recommendations

### Do Now (Quick Wins)
1. **Speed up page fade**: `duration-300` instead of `duration-500`
2. **Remove mystery N icon** from action bar
3. **Apply glass effect to Location** card to match header
4. **Add View Transitions API** for native page slide effect

### Do Later (Phase 2)
1. **Shared Element Transition** for hero image (Framer Motion `layoutId`)
2. **Add content placeholders** ("What People Say", photo gallery)
3. **Standardize all animations** to one system with consistent timing curve

---

## Transition Patterns Across Site

| Component | Current Animation | Notes |
|-----------|-------------------|-------|
| `BottomNav` | Framer Motion (slide up) | Works well, smooth. |
| `SwipeDeck` | Framer Motion (drag gestures) | Critical for experience. |
| `HomeClient` filters | CSS `animate-in slide-in-from-top` | Quick, works. |
| `Details page` | CSS `animate-in fade-in` | Too slow (500ms). |
| `HoursDisplay` | CSS `animate-in slide-in-from-top` | Good, 200ms. |

**Recommendation**: Keep Framer Motion for complex gestures (Swipe, BottomNav pill). Use CSS animations for simple enter effects. Standardize duration to 200-300ms.

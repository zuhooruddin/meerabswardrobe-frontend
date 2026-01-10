/* eslint-disable react-hooks/exhaustive-deps */
import { Box, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CategoryMenuCard from "./CategoryMenuCard";

// Premium Wrapper with better z-index and positioning
const Wrapper = styled(Box)(({ open, theme: { direction } }) => ({
  cursor: "pointer",
  position: "relative",
  zIndex: 1600, // High z-index to ensure it's above Sticky (1500) and Header (1000)
  "& .dropdown-icon": {
    transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
    transform: `rotate(${
      open ? (direction === "rtl" ? "-90deg" : "90deg") : "0deg"
    })`,
  },
}));

// ===========================================================

// ===========================================================
const CategoryMenu = ({ open: isOpen = false, children, navCategories }) => {
  const [open, setOpen] = useState(isOpen);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const popoverRef = useRef(open);
  popoverRef.current = open;

  const toggleMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    // Always allow toggling, regardless of isOpen prop
    const newOpenState = !open;
    
    // Update position BEFORE setting state when opening
    if (newOpenState && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width,
      });
    }
    
    setOpen(newOpenState);
    
    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('CategoryMenu toggle:', { 
        currentState: open, 
        newState: newOpenState,
        isOpenProp: isOpen,
        position: triggerRef.current ? triggerRef.current.getBoundingClientRect() : null
      });
    }
  };

  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Don't close if clicking inside the menu or on the trigger
      if (popoverRef.current) {
        const target = e.target;
        const menuElement = document.querySelector('.category-menu-card-wrapper');
        const triggerElement = triggerRef.current;
        
        // Check if click is outside both menu and trigger
        const isClickInsideMenu = menuElement && menuElement.contains(target);
        const isClickOnTrigger = triggerElement && (triggerElement.contains(target) || triggerElement === target);
        
        if (!isClickInsideMenu && !isClickOnTrigger) {
          setOpen(false);
        }
      }
    };

    if (open) {
      // Add click listener when menu is open
      // Use setTimeout to ensure this runs after the click that opened it
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleDocumentClick, true);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleDocumentClick, true);
      };
    }
  }, [open]);

  // Update state when isOpen prop changes
  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  // Calculate menu position when opening
  useEffect(() => {
    if (open && triggerRef.current) {
      const updatePosition = () => {
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect();
          // For fixed positioning, use viewport coordinates directly (no scroll offset needed)
          const newPosition = {
            top: rect.bottom + 8,
            left: rect.left,
            width: rect.width,
          };
          setMenuPosition(newPosition);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('Menu position updated:', newPosition);
          }
        }
      };
      
      // Initial position update
      updatePosition();
      
      // Update position on scroll and resize
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      // Also update on any scroll event to keep menu aligned
      document.addEventListener('scroll', updatePosition, true);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
        document.removeEventListener('scroll', updatePosition, true);
      };
    } else if (!open) {
      // Reset position when closed
      setMenuPosition({ top: 0, left: 0, width: 0 });
    }
  }, [open]);

  const menuCard = open && typeof window !== 'undefined' && triggerRef.current ? (
    createPortal(
      <CategoryMenuCard 
        open={open} 
        navCategories={navCategories}
        className="category-menu-card-wrapper"
        style={{
          position: 'fixed',
          top: `${menuPosition.top}px`,
          left: `${menuPosition.left}px`,
          width: `${Math.max(menuPosition.width || 420, 420)}px`,
        }}
      />,
      document.body
    )
  ) : null;

  return (
    <Wrapper open={open} ref={triggerRef}>
      {React.cloneElement(children, {
        open,
        onClick: toggleMenu,
        className: `${children.props.className || ''} category-menu-trigger`,
      })}

      {menuCard}
    </Wrapper>
  );
};

export default CategoryMenu;

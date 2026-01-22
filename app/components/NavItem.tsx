'use client';

import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export default function NavItem({ href, label, icon }: NavItemProps) {
  return (
    <ListItem disablePadding>
      <ListItemButton component={Link} href={href}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
}

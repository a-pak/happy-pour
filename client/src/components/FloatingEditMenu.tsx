import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import EuroIcon from '@mui/icons-material/Euro';
import theme from '../Theme';
import CloseIcon from '@mui/icons-material/Close';


const FloatingEditMenu: React.FC<{ barId: number }> = ({ barId }) => {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      label: 'Update Happy Hours',
      icon: <LocalDrinkIcon />,
      link: `/bars/${barId}/happy-hours/create`,
    },
    {
      label: 'Update Prices',
      icon: <EuroIcon />,
      link: `/bars/${barId}/prices/update`,
    },
    {
      label: 'Edit Bar Info',
      icon: <InfoIcon />,
      link: `/bars/${barId}/update`,
    },
  ];

  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <SpeedDial
      ariaLabel="Edit Bar Options"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
      open={open}
      direction="up"
      FabProps={{
        onClick: handleToggle,
        onMouseEnter: (e) => e.stopPropagation(),
        onMouseLeave: (e) => e.stopPropagation(),
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.label}
          icon={
            <Link
              to={action.link}
              style={{
                color: theme.palette.primary.contrastText,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {action.icon}
            </Link>
          }
          tooltipTitle={action.label} // 🔹 teksti näkyy tooltipissa
          tooltipOpen={false}          // tooltip näkyy oletusarvoisesti hoverilla
          FabProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none',
              '&:hover': { background: 'transparent' },
            },
          }}
          sx={{
            '& .MuiFab-root': {
              backgroundColor: 'transparent',
              boxShadow: 'none',
            },
          }}
        />
      ))}
    </SpeedDial>
  );
};

export default FloatingEditMenu;

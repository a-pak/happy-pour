import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import theme from '../Theme';
import CloseIcon from '@mui/icons-material/Close';
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import LiquorIcon from '@mui/icons-material/Liquor';


const FloatingEditMenu: React.FC<{ barId: number }> = ({ barId }) => {
  const [open, setOpen] = useState(false);

  const actions = [
    {
      label: 'Update Happy Hours',
      icon: <MoreTimeIcon />,
      link: `/bars/${barId}/happy-hours/create`,
    },
    {
      label: 'Submit Drink Prices',
      icon: <LiquorIcon />,
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
          slotProps={{
            tooltip: {
              title: action.label,
              open: false,
              placement: 'left',
              sx: {
                '& .MuiTooltip-tooltip': {
                  whiteSpace: 'nowrap',
                  fontSize: '12px',
                  backgroundColor: theme.palette.primary.dark,
                  color: theme.palette.primary.contrastText,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '250px',
                },
              },
            },
          }}

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

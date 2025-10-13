import React from 'react';
import { Link } from 'react-router-dom';
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import theme from '../Theme';

const FloatingEditMenu: React.FC<{ barId: number }> = ({ barId }) => {
  const actions = [
    { icon: <>🍻</>, name: 'Update Happy Hours', link: `/bars/${barId}/happy-hours/create` },
    { icon: <>💶</>, name: 'Update Prices', link: `/bars/${barId}/prices/update` },
    { icon: <><InfoIcon /></>, name: 'Edit Bar Info', link: `/bars/${barId}/update` },
  ];

  return (
    <SpeedDial
      ariaLabel="Edit Bar Options"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon openIcon={<EditIcon />} />}
    >
      {actions.map(action => (
        <SpeedDialAction
          key={action.name}
          icon={
            <Link to={action.link} style={{ color: theme.palette.primary.contrastText }}>
              <Box sx={{ fontSize: 28 }}>{action.icon}</Box>
            </Link>
          }
          sx={{
        '& .MuiFab-primary': {
          width: 48,
          height: 48,
        },
        '& .MuiSvgIcon-root': {
          fontSize: 28,
        },
      }}
        />
      ))}
    </SpeedDial>
  );
};

export default FloatingEditMenu;

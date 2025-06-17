'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import {
  Email as EmailIcon,
  Chat as ChatIcon,
  MoreVert as MoreVertIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

type CandidateStatus = 'pending' | 'responded' | 'overdue';

interface EndorsedCandidate {
  id: string;
  name: string;
  role: string;
  clientName: string;
  timeSinceEndorsement: string;
  status: CandidateStatus;
  lastContact: string;
  avatar?: string;
}

const generateMockCandidates = (): EndorsedCandidate[] => [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Senior Frontend Developer',
    clientName: 'TechCorp Inc.',
    timeSinceEndorsement: '2 days ago',
    status: 'pending',
    lastContact: '2025-06-16',
    avatar: '/avatars/alex.jpg',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    role: 'Product Manager',
    clientName: 'InnoTech Solutions',
    timeSinceEndorsement: '5 days ago',
    status: 'overdue',
    lastContact: '2025-06-13',
    avatar: '/avatars/sarah.jpg',
  },
  {
    id: '3',
    name: 'Michael Chen',
    role: 'DevOps Engineer',
    clientName: 'CloudScale',
    timeSinceEndorsement: '1 day ago',
    status: 'responded',
    lastContact: '2025-06-17',
    avatar: '/avatars/michael.jpg',
  },
];

const ClientFollowUpDashboard: React.FC = () => {
  // Initialize with mock data
  const [candidates] = useState<EndorsedCandidate[]>(generateMockCandidates());
  const [selectedCandidate, setSelectedCandidate] = useState<EndorsedCandidate | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleGenerateMessage = (candidate: EndorsedCandidate) => {
    setSelectedCandidate(candidate);
    setIsGenerating(true);
    
    // Simulate API call to generate message
    setTimeout(() => {
      setMessage(`Hi ${candidate.clientName.split(' ')[0]},\n\nI hope this message finds you well. I'm following up regarding ${candidate.name}, who we recently endorsed for the ${candidate.role} position. We believe ${candidate.name.split(' ')[0]} would be a great fit for your team.\n\nPlease let us know if you've had a chance to review their profile or if you need any additional information.\n\nBest regards,\nYour Recruiter`);
      setIsGenerating(false);
    }, 1500);
  };

  const handleSendMessage = (type: 'email' | 'whatsapp') => {
    // Implement actual sending logic here
    console.log(`Sending ${type} to ${selectedCandidate?.clientName}`, message);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusChip = (status: CandidateStatus) => {
    switch (status) {
      case 'responded':
        return (
          <Chip
            icon={<CheckCircleIcon fontSize="small" />}
            label="Responded"
            color="success"
            size="small"
            variant="outlined"
          />
        );
      case 'overdue':
        return (
          <Chip
            icon={<WarningIcon fontSize="small" />}
            label="Overdue"
            color="error"
            size="small"
            variant="outlined"
          />
        );
      default:
        return (
          <Chip
            icon={<AccessTimeIcon fontSize="small" />}
            label="Pending"
            color="warning"
            size="small"
            variant="outlined"
          />
        );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Client Follow-Up Dashboard
      </Typography>
      
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, alignItems: 'center' }}>
            <Box>
              <TextField
                fullWidth
                label="Search candidates or clients"
                variant="outlined"
                size="small"
              />
            </Box>
            <Box>
              <TextField
                select
                fullWidth
                label="Filter by status"
                variant="outlined"
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="overdue">Overdue</option>
              </TextField>
            </Box>
            <Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => {}}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Candidate</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Contact</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                hover
                sx={{
                  '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                  borderLeft: candidate.status === 'overdue' ? '4px solid #f44336' : 'none',
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      src={candidate.avatar}
                      sx={{ width: 40, height: 40, mr: 2 }}
                    >
                      {candidate.name.charAt(0)}
                    </Avatar>
                    <Typography variant="body1">{candidate.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {candidate.role}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">{candidate.clientName}</Typography>
                </TableCell>
                <TableCell>
                  {getStatusChip(candidate.status)}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="textSecondary">
                    {candidate.timeSinceEndorsement}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleGenerateMessage(candidate)}
                    disabled={isGenerating}
                    sx={{ mr: 1 }}
                  >
                    {isGenerating && selectedCandidate?.id === candidate.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      'Follow Up'
                    )}
                  </Button>
                  <IconButton size="small" onClick={handleMenuOpen}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {message && (
        <Card sx={{ mt: 3, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Follow-Up Message</Typography>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EmailIcon />}
                  onClick={() => handleSendMessage('email')}
                  sx={{ mr: 1 }}
                >
                  Send Email
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ChatIcon />}
                  onClick={() => handleSendMessage('whatsapp')}
                >
                  Send WhatsApp
                </Button>
              </Box>
            </Box>
            <Paper variant="outlined" sx={{ p: 2, minHeight: 150, whiteSpace: 'pre-line' }}>
              {message}
            </Paper>
          </CardContent>
        </Card>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Candidate Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>View Client Details</MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Mark as Inactive
        </MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Message Sent</DialogTitle>
        <DialogContent>
          <Typography>Your message has been sent successfully!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClientFollowUpDashboard;

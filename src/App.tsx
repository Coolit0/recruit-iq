import React, { useState } from 'react';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField, 
  Grid, 
  Chip, 
  CircularProgress,
  Tabs,
  Tab,
  AppBar,
  Toolbar
} from '@mui/material';
import { CloudUpload, ContentCopy, PictureAsPdf, WorkOutline } from '@mui/icons-material';
import JDAnalyzer from './components/JDAnalyzer';
import { useDropzone } from 'react-dropzone';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          padding: '8px 20px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const [screeningNotes, setScreeningNotes] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  const [endorsement, setEndorsement] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setResumeFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const generateEndorsement = () => {
    if (!resumeText.trim() && !screeningNotes.trim()) {
      alert('Please provide either resume text or screening notes');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would be an API call to your backend
      const mockEndorsement = `Based on the candidate's experience at ${resumeText.split('\n')[0] || 'various companies'} and the provided screening notes, this candidate demonstrates strong potential for the role.`;
      setEndorsement(mockEndorsement);
      setSkills(['React', 'TypeScript', 'Node.js', 'AWS', 'Agile']);
      setConfidence(87);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(endorsement);
  };

  const downloadAsPdf = () => {
    const input = document.getElementById('endorsement-preview');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('candidate-endorsement.pdf');
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            RecruitIQ
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Resume Parser" icon={<PictureAsPdf />} />
            <Tab label="JD Analyzer" icon={<WorkOutline />} />
          </Tabs>
        </Paper>
        
        {activeTab === 0 && (
          <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 6 }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mb: 4 }}>
              <Container maxWidth="lg">
                <Typography variant="h4" component="h1" gutterBottom>
                  RecruitIQ
                </Typography>
                <Typography variant="subtitle1">
                  AI-Powered Candidate Endorsement Generator
                </Typography>
              </Container>
            </Box>

            <Container maxWidth="lg">
              <Grid container spacing={4}>
                {/* Left Column - Input */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Candidate Information
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Upload Resume (TXT, PDF, DOC, DOCX)
                      </Typography>
                      <Box
                        {...getRootProps()}
                        sx={{
                          border: '2px dashed #ccc',
                          borderRadius: 2,
                          p: 4,
                          textAlign: 'center',
                          cursor: 'pointer',
                          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                          transition: 'background-color 0.3s',
                        }}
                      >
                        <input {...getInputProps()} />
                        <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography>
                          {isDragActive
                            ? 'Drop the file here'
                            : 'Drag & drop a resume file here, or click to select'}
                        </Typography>
                        {resumeFile && (
                          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            Selected: {resumeFile.name}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <TextField
                        label="Or paste resume text here"
                        multiline
                        rows={6}
                        fullWidth
                        variant="outlined"
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste the candidate's resume text here..."
                      />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <TextField
                        label="Screening Notes"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={screeningNotes}
                        onChange={(e) => setScreeningNotes(e.target.value)}
                        placeholder="Add any additional screening notes or requirements here..."
                      />
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      onClick={generateEndorsement}
                      disabled={isLoading}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                      {isLoading ? 'Generating...' : 'Generate Endorsement'}
                    </Button>
                  </Paper>
                </Grid>

                {/* Right Column - Output */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">Endorsement Preview</Typography>
                      <Box>
                        <Button
                          size="small"
                          startIcon={<ContentCopy fontSize="small" />}
                          onClick={copyToClipboard}
                          disabled={!endorsement}
                          sx={{ mr: 1 }}
                        >
                          Copy
                        </Button>
                        <Button
                          size="small"
                          startIcon={<PictureAsPdf fontSize="small" />}
                          onClick={downloadAsPdf}
                          disabled={!endorsement}
                          color="secondary"
                        >
                          PDF
                        </Button>
                      </Box>
                    </Box>

                    {confidence !== null && (
                      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              AI Confidence
                            </Typography>
                            <Typography variant="caption" fontWeight="medium">
                              {confidence}%
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, overflow: 'hidden' }}>
                            <Box
                              sx={{
                                width: `${confidence}%`,
                                height: 8,
                                bgcolor: confidence > 75 ? 'success.main' : confidence > 50 ? 'warning.main' : 'error.main',
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {skills.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Key Skills
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {skills.map((skill, index) => (
                            <Chip key={index} label={skill} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    <Paper
                      id="endorsement-preview"
                      elevation={0}
                      sx={{
                        flex: 1,
                        p: 3,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'auto',
                        minHeight: 200,
                      }}
                    >
                      {endorsement ? (
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                          {endorsement}
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'text.secondary',
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" align="center">
                            Your generated endorsement will appear here.
                            <br />
                            Fill in the left panel and click "Generate Endorsement".
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          </Box>
        )}
        
        {activeTab === 1 && (
          <JDAnalyzer />
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;

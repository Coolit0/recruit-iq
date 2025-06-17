'use client';

import { useState } from "react";
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
  Tab
} from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import { CloudUpload, ContentCopy, PictureAsPdf } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ClientFollowUpDashboard from "./ClientFollowUpDashboard";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f7fa" },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
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
  const [tab, setTab] = useState("1");
  const [resumeText, setResumeText] = useState("");
  const [screeningNotes, setScreeningNotes] = useState("");
  const [endorsement, setEndorsement] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<number | null>(0);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

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
      "text/plain": [".txt"],
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
  });

  const generateEndorsement = () => {
    if (!resumeText.trim() && !screeningNotes.trim()) {
      alert("Please provide either resume text or screening notes");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
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
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mb: 4 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>RecruitIQ</Typography>
            <Typography variant="subtitle1">AI-Powered Candidate Endorsement Generator</Typography>
          </Container>
        </Box>

        <Container maxWidth="lg">
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={tab} onChange={handleTabChange} aria-label="main tabs">
                <Tab label="Endorsement Generator" value="1" />
                <Tab label="Follow-up Dashboard" value="2" />
              </Tabs>
            </Box>

            <TabPanel value="1">
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Candidate Information</Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2">Upload Resume</Typography>
                      <Box
                        {...getRootProps()}
                        sx={{
                          border: '2px dashed #ccc',
                          borderRadius: 2,
                          p: 4,
                          textAlign: 'center',
                          cursor: 'pointer',
                          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
                        }}
                      >
                        <input {...getInputProps()} />
                        <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography>
                          {isDragActive ? 'Drop the file here' : 'Drag & drop a resume file or click'}
                        </Typography>
                        {resumeFile && (
                          <Typography variant="caption">Selected: {resumeFile.name}</Typography>
                        )}
                      </Box>
                    </Box>

                    <TextField
                      label="Or paste resume text here"
                      multiline
                      rows={6}
                      fullWidth
                      variant="outlined"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      label="Screening Notes"
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      value={screeningNotes}
                      onChange={(e) => setScreeningNotes(e.target.value)}
                      sx={{ mb: 3 }}
                    />

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

                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">Endorsement Preview</Typography>
                      <Box>
                        <Button
                          size="small"
                          onClick={copyToClipboard}
                          startIcon={<ContentCopy />}
                          disabled={!endorsement}
                          sx={{ mr: 1 }}
                        >
                          Copy
                        </Button>
                        <Button
                          size="small"
                          onClick={downloadAsPdf}
                          startIcon={<PictureAsPdf />}
                          color="secondary"
                          disabled={!endorsement}
                        >
                          PDF
                        </Button>
                      </Box>
                    </Box>

                    {confidence !== null && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption">AI Confidence: {confidence}%</Typography>
                        <Box sx={{ height: 8, bgcolor: 'grey.300', borderRadius: 1, mt: 0.5 }}>
                          <Box
                            sx={{
                              width: `${confidence}%`,
                              height: '100%',
                              bgcolor:
                                confidence > 75
                                  ? 'success.main'
                                  : confidence > 50
                                  ? 'warning.main'
                                  : 'error.main',
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    {skills.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2">Key Skills</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {skills.map((skill, i) => (
                            <Chip key={i} label={skill} size="small" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    <Paper
                      id="endorsement-preview"
                      elevation={0}
                      sx={{
                        flex: 1,
                        p: 2,
                        bgcolor: 'background.paper',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        overflow: 'auto',
                        minHeight: 200,
                      }}
                    >
                      {endorsement ? (
                        <Typography sx={{ whiteSpace: 'pre-line' }}>{endorsement}</Typography>
                      ) : (
                        <Typography color="text.secondary" align="center">
                          Your generated endorsement will appear here.
                          <br />
                          Fill in the left panel and click "Generate Endorsement".
                        </Typography>
                      )}
                    </Paper>
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value="2">
              <ClientFollowUpDashboard />
            </TabPanel>
          </TabContext>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;

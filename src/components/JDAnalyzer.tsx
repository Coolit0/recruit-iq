import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  TextField, 
  Typography, 
  Paper,
  Chip
} from '@mui/material';
import { AutoStories, Work, Category, PersonSearch } from '@mui/icons-material';

interface AnalysisResult {
  isHybrid: boolean;
  category: number;
  recruiterSpecialization: string;
  clarifications: string[];
}

const JDAnalyzer: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  // Mock analysis function
  const analyzeJobDescription = (): Promise<AnalysisResult> => {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple mock analysis based on content
        const isHybrid = jobDescription.toLowerCase().includes('hybrid') || 
                        jobDescription.toLowerCase().includes('remote') ||
                        Math.random() > 0.5;
        
        const categories = [1, 2, 3, 4, 5];
        const specializations = [
          'Technical Recruitment',
          'Executive Search',
          'Volume Hiring',
          'Niche Skills',
          'C-Suite Placement'
        ];
        
        const clarifications = [
          'Clarify budget range',
          'Confirm interview process',
          'Ask about remote work policy',
          'Verify required certifications',
          'Check visa sponsorship availability'
        ];
        
        // Select random items for demo purposes
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomSpecialization = specializations[Math.floor(Math.random() * specializations.length)];
        
        // Shuffle and pick 2-3 clarifications
        const shuffledClarifications = [...clarifications]
          .sort(() => 0.5 - Math.random())
          .slice(0, 2 + Math.floor(Math.random() * 2));
        
        resolve({
          isHybrid,
          category: randomCategory,
          recruiterSpecialization: randomSpecialization,
          clarifications: shuffledClarifications
        });
      }, 1500);
    });
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }
    
    setError('');
    setIsAnalyzing(true);
    
    try {
      const result = await analyzeJobDescription();
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze job description. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setAnalysis(null);
    setError('');
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        JD Analyzer
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          placeholder="Paste job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          disabled={isAnalyzing}
          sx={{ mb: 2 }}
        />
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            onClick={handleClear}
            disabled={isAnalyzing || (!jobDescription && !analysis)}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !jobDescription.trim()}
            startIcon={isAnalyzing ? <CircularProgress size={20} /> : null}
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze JD'}
          </Button>
        </Box>
      </Paper>
      
      {analysis && (
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoStories color="primary" /> Job Analysis Results
            </Typography>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '8px' }}>
              <div style={{ flex: '1 1 300px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Work color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Work Type:</strong> {analysis.isHybrid ? 'Hybrid/Remote' : 'On-site'}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Category color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Category:</strong> Category {analysis.category}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonSearch color="action" sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    <strong>Recruiter:</strong> {analysis.recruiterSpecialization}
                  </Typography>
                </Box>
              </div>
              
              <div style={{ flex: '1 1 300px' }}>
                <Typography variant="subtitle2" gutterBottom>
                  Suggested Client Clarifications:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {analysis.clarifications.map((item, index) => (
                    <Chip 
                      key={index} 
                      label={item} 
                      size="small" 
                      variant="outlined"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default JDAnalyzer;

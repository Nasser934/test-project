import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  card: {
    height: '100%',
    minHeight: 400,
  },
  chartContainer: {
    height: 300,
    marginTop: theme.spacing(2),
  },
}));

interface DetailedStats {
  monthlyActivity: {
    date: string;
    cvViews: number;
    cvDownloads: number;
    cvEdits: number;
  }[];
  skillsUsage: {
    name: string;
    count: number;
    percentage: number;
  }[];
  industryDistribution: {
    industry: string;
    count: number;
  }[];
  experienceLevels: {
    level: string;
    count: number;
  }[];
}

interface Props {
  stats: DetailedStats;
}

export const DetailedAnalytics: React.FC<Props> = ({ stats }) => {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = React.useState(0);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" gutterBottom>
        تحليلات تفصيلية
      </Typography>

      <Tabs
        value={currentTab}
        onChange={(_, newValue) => setCurrentTab(newValue)}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="تحليلات تفصيلية"
      >
        <Tab label="النشاط الشهري" />
        <Tab label="المهارات" />
        <Tab label="التوزيع الصناعي" />
        <Tab label="مستويات الخبرة" />
      </Tabs>

      <div role="tabpanel" hidden={currentTab !== 0}>
        {currentTab === 0 && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                النشاط الشهري
              </Typography>
              <div className={classes.chartContainer}>
                <ResponsiveContainer>
                  <LineChart data={stats.monthlyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="cvViews" name="المشاهدات" stroke="#8884d8" />
                    <Line type="monotone" dataKey="cvDownloads" name="التحميلات" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="cvEdits" name="التعديلات" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div role="tabpanel" hidden={currentTab !== 1}>
        {currentTab === 1 && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                توزيع المهارات
              </Typography>
              <div className={classes.chartContainer}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={stats.skillsUsage}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {stats.skillsUsage.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div role="tabpanel" hidden={currentTab !== 2}>
        {currentTab === 2 && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                التوزيع الصناعي
              </Typography>
              <div className={classes.chartContainer}>
                <ResponsiveContainer>
                  <BarChart data={stats.industryDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="industry" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8">
                      {stats.industryDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Paper>
  );
}; 
import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Card } from '@/components/ui/card';
import {
  Activity,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
} from 'lucide-react';

// Mock data generation functions
const generateRevenueData = () => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(() => Math.floor(Math.random() * 50000) + 30000);
};

const generatePatientGrowthData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map((_, index) => 120 + index * 15 + Math.floor(Math.random() * 20));
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const StatCard = ({ title, value, icon, trend, trendUp }: StatCardProps) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
        {trend && (
          <p
            className={`text-sm mt-2 flex items-center gap-1 ${
              trendUp ? 'text-green-600' : 'text-red-600'
            }`}
          >
            <TrendingUp className={`w-4 h-4 ${!trendUp && 'rotate-180'}`} />
            {trend}
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
    </div>
  </Card>
);

const Dashboard = () => {
  const [revenueData] = useState(generateRevenueData());
  const [patientGrowthData] = useState(generatePatientGrowthData());

  // Revenue Chart Options
  const revenueChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        formatter: (value) => `₹${value.toLocaleString()}`,
      },
    },
  };

  const revenueSeries = [
    {
      name: 'Revenue',
      data: revenueData,
    },
  ];

  // Visit Types Chart Options
  const visitTypesOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '60%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ['New', 'Follow-up', 'Emergency', 'Referral'],
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
    tooltip: {
      y: {
        formatter: (value) => `${value} visits`,
      },
    },
  };

  const visitTypesSeries = [
    {
      name: 'Visits',
      data: [145, 98, 32, 15],
    },
  ];

  // Payment Status Donut Chart
  const paymentStatusOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
    },
    labels: ['Paid', 'Unpaid', 'Partial'],
    colors: ['#10b981', '#ef4444', '#f59e0b'],
    legend: {
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total Bills',
              formatter: () => '290',
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} bills`,
      },
    },
  };

  const paymentStatusSeries = [185, 62, 43];

  // Patient Growth Line Chart
  const patientGrowthOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 5,
      colors: ['#3b82f6'],
      strokeColors: '#fff',
      strokeWidth: 2,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        formatter: (value) => `${value} patients`,
      },
    },
  };

  const patientGrowthSeries = [
    {
      name: 'New Patients',
      data: patientGrowthData,
    },
  ];

  // Visit Status Radial Chart
  const visitStatusOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 350,
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '30%',
          background: 'transparent',
        },
        dataLabels: {
          name: {
            show: true,
          },
          value: {
            show: true,
          },
        },
      },
    },
    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
    labels: ['Completed', 'In Progress', 'Waiting', 'Cancelled'],
    legend: {
      show: true,
      floating: true,
      fontSize: '14px',
      position: 'left',
      offsetX: 10,
      offsetY: 10,
      labels: {
        useSeriesColors: true,
      },
    },
  };

  const visitStatusSeries = [76, 12, 8, 4];

  // Top Services Bar Chart
  const topServicesOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [
        'General Consultation',
        'Blood Test',
        'X-Ray',
        'ECG',
        'Ultrasound',
        'Vaccination',
      ],
    },
    colors: ['#3b82f6'],
    tooltip: {
      y: {
        formatter: (value) => `${value} times`,
      },
    },
  };

  const topServicesSeries = [
    {
      name: 'Count',
      data: [156, 98, 72, 58, 45, 32],
    },
  ];

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Total Patients"
            value="1,234"
            icon={<Users className="w-6 h-6 text-blue-600" />}
            trend="+12% from last month"
            trendUp={true}
          />
          <StatCard
            title="Today's Visits"
            value="48"
            icon={<Calendar className="w-6 h-6 text-blue-600" />}
            trend="+5% from yesterday"
            trendUp={true}
          />
          <StatCard
            title="Total Revenue"
            value="₹2,45,680"
            icon={<DollarSign className="w-6 h-6 text-blue-600" />}
            trend="+8% from last week"
            trendUp={true}
          />
          <StatCard
            title="Pending Bills"
            value="23"
            icon={<FileText className="w-6 h-6 text-blue-600" />}
            trend="-3% from yesterday"
            trendUp={false}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Weekly Revenue
            </h3>
            <Chart
              options={revenueChartOptions}
              series={revenueSeries}
              type="area"
              height={350}
            />
          </Card>

          {/* Visit Types Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Visits by Type
            </h3>
            <Chart
              options={visitTypesOptions}
              series={visitTypesSeries}
              type="bar"
              height={350}
            />
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Payment Status Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Payment Status Distribution
            </h3>
            <Chart
              options={paymentStatusOptions}
              series={paymentStatusSeries}
              type="donut"
              height={350}
            />
          </Card>

          {/* Patient Growth Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Patient Growth (6 Months)
            </h3>
            <Chart
              options={patientGrowthOptions}
              series={patientGrowthSeries}
              type="line"
              height={350}
            />
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visit Status Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Visit Status Overview
            </h3>
            <Chart
              options={visitStatusOptions}
              series={visitStatusSeries}
              type="radialBar"
              height={350}
            />
          </Card>

          {/* Top Services Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Most Common Services
            </h3>
            <Chart
              options={topServicesOptions}
              series={topServicesSeries}
              type="bar"
              height={350}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

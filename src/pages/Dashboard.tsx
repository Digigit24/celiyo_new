import { useMemo } from 'react';
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
  Loader2,
} from 'lucide-react';
import { usePatient } from '@/hooks/usePatient';
import { useOpdVisit } from '@/hooks/useOpdVisit';
import { useOPDBill } from '@/hooks/useOPDBill';

// ==================== TOGGLE BETWEEN DEMO & REAL DATA ====================
// Set to `true` for demo data, `false` for real API data
const USE_DEMO_DATA = true;
// ========================================================================

// ==================== DEMO DATA ====================
const DEMO_DATA = {
  patients: {
    total_patients: 1247,
    active_patients: 1180,
    inactive_patients: 52,
    deceased_patients: 15,
    patients_with_insurance: 834,
    average_age: 42.5,
    total_visits: 4832,
    gender_distribution: {
      Male: 687,
      Female: 523,
      Other: 37,
    },
    blood_group_distribution: {
      'A+': 342,
      'A-': 87,
      'B+': 298,
      'B-': 64,
      'AB+': 156,
      'AB-': 43,
      'O+': 187,
      'O-': 70,
    },
  },
  visits: {
    total_visits: 4832,
    today_visits: 48,
    waiting_patients: 12,
    in_progress_patients: 5,
    completed_today: 31,
    average_waiting_time: '15 mins',
    visits_by_type: {
      new: 1245,
      follow_up: 2987,
      emergency: 432,
      referral: 168,
    },
    visits_by_status: {
      waiting: 12,
      in_progress: 5,
      completed: 4698,
      cancelled: 87,
      no_show: 30,
    },
    revenue_today: '45680',
    pending_payments: 23,
  },
  bills: {
    total_bills: 3421,
    total_amount: '12450000',
    received_amount: '10890000',
    balance_amount: '1560000',
    paid_bills: 2856,
    unpaid_bills: 398,
    partial_bills: 167,
  },
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  loading?: boolean;
  gradient: string;
}

const StatCard = ({ title, value, icon, trend, trendUp, loading, gradient }: StatCardProps) => (
  <Card className={`relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 ${gradient}`}>
    <div className="p-6 relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600/80">{title}</p>
          {loading ? (
            <div className="mt-2">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <h3 className="text-3xl font-bold mt-2 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {value}
            </h3>
          )}
          {trend && !loading && (
            <p
              className={`text-xs mt-2 flex items-center gap-1 font-medium ${
                trendUp ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              <TrendingUp className={`w-3 h-3 ${!trendUp && 'rotate-180'}`} />
              {trend}
            </p>
          )}
        </div>
        <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl shadow-sm">{icon}</div>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none" />
  </Card>
);

const Dashboard = () => {
  const { usePatientStatistics } = usePatient();
  const { useOpdVisitStatistics } = useOpdVisit();
  const { useOPDBillStatistics } = useOPDBill();

  // Fetch real data (only used when USE_DEMO_DATA = false)
  const { data: realPatientStats, isLoading: patientLoading } = usePatientStatistics();
  const { data: realVisitStats, isLoading: visitLoading } = useOpdVisitStatistics();
  const { data: realBillStats, isLoading: billLoading } = useOPDBillStatistics();

  // Select data source based on toggle
  const patientStats = USE_DEMO_DATA ? DEMO_DATA.patients : realPatientStats;
  const visitStats = USE_DEMO_DATA ? DEMO_DATA.visits : realVisitStats;
  const billStats = USE_DEMO_DATA ? DEMO_DATA.bills : realBillStats;
  const isLoading = USE_DEMO_DATA ? false : (patientLoading || visitLoading || billLoading);

  // Calculate weekly revenue data (last 7 days)
  const weeklyRevenueData = useMemo(() => {
    if (!billStats) return Array(7).fill(0);
    const baseRevenue = parseFloat(billStats.received_amount || '0');

    if (USE_DEMO_DATA) {
      // Demo: More realistic weekly variation
      return [
        Math.floor(baseRevenue * 0.11 + Math.random() * 10000),
        Math.floor(baseRevenue * 0.14 + Math.random() * 10000),
        Math.floor(baseRevenue * 0.15 + Math.random() * 10000),
        Math.floor(baseRevenue * 0.16 + Math.random() * 10000),
        Math.floor(baseRevenue * 0.14 + Math.random() * 10000),
        Math.floor(baseRevenue * 0.13 + Math.random() * 10000),
        Math.floor(baseRevenue * 0.12 + Math.random() * 10000),
      ];
    }

    // Real data: Simulate weekly distribution
    return [
      Math.floor(baseRevenue * 0.12),
      Math.floor(baseRevenue * 0.15),
      Math.floor(baseRevenue * 0.13),
      Math.floor(baseRevenue * 0.16),
      Math.floor(baseRevenue * 0.14),
      Math.floor(baseRevenue * 0.15),
      Math.floor(baseRevenue * 0.15),
    ];
  }, [billStats]);

  // Visit types data
  const visitTypesData = useMemo(() => {
    if (!visitStats?.visits_by_type) return [0, 0, 0, 0];
    return [
      visitStats.visits_by_type.new || 0,
      visitStats.visits_by_type.follow_up || 0,
      visitStats.visits_by_type.emergency || 0,
      visitStats.visits_by_type.referral || 0,
    ];
  }, [visitStats]);

  // Payment status data
  const paymentStatusData = useMemo(() => {
    if (!billStats) return [0, 0, 0];
    return [billStats.paid_bills || 0, billStats.unpaid_bills || 0, billStats.partial_bills || 0];
  }, [billStats]);

  // Patient growth simulation (6 months)
  const patientGrowthData = useMemo(() => {
    if (!patientStats) return Array(6).fill(0);
    const totalPatients = patientStats.total_patients || 0;

    if (USE_DEMO_DATA) {
      // Demo: Show realistic growth trend
      const baseGrowth = Math.floor(totalPatients * 0.7);
      return [
        baseGrowth,
        baseGrowth + Math.floor(totalPatients * 0.04),
        baseGrowth + Math.floor(totalPatients * 0.09),
        baseGrowth + Math.floor(totalPatients * 0.15),
        baseGrowth + Math.floor(totalPatients * 0.22),
        totalPatients,
      ];
    }

    // Real data: Simulate growth
    const avgGrowth = Math.floor(totalPatients / 20);
    return Array(6)
      .fill(0)
      .map((_, i) => Math.floor(totalPatients * 0.6 + avgGrowth * i + Math.random() * avgGrowth));
  }, [patientStats]);

  // Visit status percentage
  const visitStatusData = useMemo(() => {
    if (!visitStats?.visits_by_status) return [0, 0, 0, 0];
    const total = visitStats.total_visits || 1;
    return [
      Math.round(((visitStats.visits_by_status.completed || 0) / total) * 100),
      Math.round(((visitStats.visits_by_status.in_progress || 0) / total) * 100),
      Math.round(((visitStats.visits_by_status.waiting || 0) / total) * 100),
      Math.round(((visitStats.visits_by_status.cancelled || 0) / total) * 100),
    ];
  }, [visitStats]);

  // Chart Options with 3D effects and minimal design
  const revenueChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 320,
      toolbar: { show: false },
      zoom: { enabled: false },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.1,
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: '#6B7280', fontSize: '12px' },
        formatter: (value) => `₹${(value / 1000).toFixed(0)}k`,
      },
    },
    colors: ['#6366F1'],
    grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
    tooltip: {
      y: { formatter: (value) => `₹${value.toLocaleString()}` },
      theme: 'light',
    },
  };

  const visitTypesOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.1,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '55%',
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['New', 'Follow-up', 'Emergency', 'Referral'],
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    },
    colors: ['#6366F1', '#10B981', '#F59E0B', '#EF4444'],
    grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
    legend: { show: false },
    tooltip: {
      y: { formatter: (value) => `${value} visits` },
      theme: 'light',
    },
  };

  const paymentStatusOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 320,
      dropShadow: {
        enabled: true,
        blur: 3,
        opacity: 0.1,
      },
    },
    labels: ['Paid', 'Unpaid', 'Partial'],
    colors: ['#10B981', '#EF4444', '#F59E0B'],
    legend: {
      position: 'bottom',
      fontSize: '13px',
      labels: { colors: '#6B7280' },
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
              fontSize: '14px',
              color: '#6B7280',
              formatter: () => (billStats?.total_bills || 0).toString(),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 0 },
    tooltip: {
      y: { formatter: (value) => `${value} bills` },
      theme: 'light',
    },
  };

  const patientGrowthOptions: ApexOptions = {
    chart: {
      type: 'line',
      height: 320,
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.1,
      },
    },
    stroke: { curve: 'smooth', width: 4 },
    markers: {
      size: 6,
      colors: ['#fff'],
      strokeColors: '#6366F1',
      strokeWidth: 3,
      hover: { size: 8 },
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    },
    colors: ['#6366F1'],
    grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
    tooltip: {
      y: { formatter: (value) => `${value} patients` },
      theme: 'light',
    },
  };

  const visitStatusOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 320,
      dropShadow: {
        enabled: true,
        blur: 3,
        opacity: 0.1,
      },
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 270,
        hollow: {
          margin: 5,
          size: '35%',
          background: 'transparent',
        },
        dataLabels: {
          name: { fontSize: '13px', color: '#6B7280' },
          value: { fontSize: '16px', color: '#111827', fontWeight: 'bold' },
        },
        track: {
          background: '#F3F4F6',
          strokeWidth: '100%',
        },
      },
    },
    colors: ['#10B981', '#6366F1', '#F59E0B', '#EF4444'],
    labels: ['Completed', 'In Progress', 'Waiting', 'Cancelled'],
    legend: {
      show: true,
      floating: true,
      fontSize: '13px',
      position: 'left',
      offsetX: 0,
      offsetY: 10,
      labels: { colors: '#6B7280', useSeriesColors: true },
    },
  };

  const genderDistributionOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 320,
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 3,
        opacity: 0.1,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: true,
        barHeight: '70%',
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ['Male', 'Female', 'Other'],
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: { style: { colors: '#6B7280', fontSize: '12px' } },
    },
    colors: ['#6366F1', '#EC4899', '#8B5CF6'],
    grid: { borderColor: '#F3F4F6', strokeDashArray: 4 },
    legend: { show: false },
    tooltip: {
      y: { formatter: (value) => `${value} patients` },
      theme: 'light',
    },
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-500 mt-2 text-sm">
                Welcome back! Here's your hospital overview.
              </p>
            </div>
            {USE_DEMO_DATA && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                <p className="text-xs font-medium text-indigo-700">Demo Mode</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Patients"
            value={patientStats?.total_patients?.toLocaleString() || '0'}
            icon={<Users className="w-7 h-7 text-indigo-600" />}
            loading={isLoading && !USE_DEMO_DATA}
            gradient="bg-gradient-to-br from-indigo-50 via-white to-indigo-50/30"
            trend="+12% from last month"
            trendUp={true}
          />
          <StatCard
            title="Today's Visits"
            value={visitStats?.today_visits?.toLocaleString() || '0'}
            icon={<Calendar className="w-7 h-7 text-emerald-600" />}
            loading={isLoading && !USE_DEMO_DATA}
            gradient="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/30"
            trend="+5% from yesterday"
            trendUp={true}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${parseFloat(billStats?.received_amount || '0').toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            icon={<DollarSign className="w-7 h-7 text-amber-600" />}
            loading={isLoading && !USE_DEMO_DATA}
            gradient="bg-gradient-to-br from-amber-50 via-white to-amber-50/30"
            trend="+8% from last week"
            trendUp={true}
          />
          <StatCard
            title="Pending Bills"
            value={(billStats?.unpaid_bills || 0) + (billStats?.partial_bills || 0)}
            icon={<FileText className="w-7 h-7 text-rose-600" />}
            loading={isLoading && !USE_DEMO_DATA}
            gradient="bg-gradient-to-br from-rose-50 via-white to-rose-50/30"
            trend="-3% from yesterday"
            trendUp={false}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Revenue Chart */}
          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <Activity className="w-5 h-5 text-indigo-500" />
              Weekly Revenue
            </h3>
            {isLoading && !USE_DEMO_DATA ? (
              <div className="h-[320px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Chart
                options={revenueChartOptions}
                series={[{ name: 'Revenue', data: weeklyRevenueData }]}
                type="area"
                height={320}
              />
            )}
          </Card>

          {/* Visit Types Chart */}
          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <Activity className="w-5 h-5 text-indigo-500" />
              Visits by Type
            </h3>
            {isLoading && !USE_DEMO_DATA ? (
              <div className="h-[320px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Chart
                options={visitTypesOptions}
                series={[{ name: 'Visits', data: visitTypesData }]}
                type="bar"
                height={320}
              />
            )}
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Payment Status Chart */}
          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              Payment Status
            </h3>
            {isLoading && !USE_DEMO_DATA ? (
              <div className="h-[320px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Chart
                options={paymentStatusOptions}
                series={paymentStatusData}
                type="donut"
                height={320}
              />
            )}
          </Card>

          {/* Patient Growth Chart */}
          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5 text-indigo-500" />
              Patient Growth (6 Months)
            </h3>
            {isLoading && !USE_DEMO_DATA ? (
              <div className="h-[320px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Chart
                options={patientGrowthOptions}
                series={[{ name: 'New Patients', data: patientGrowthData }]}
                type="line"
                height={320}
              />
            )}
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Visit Status Chart */}
          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <Activity className="w-5 h-5 text-emerald-500" />
              Visit Status Overview
            </h3>
            {isLoading && !USE_DEMO_DATA ? (
              <div className="h-[320px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Chart
                options={visitStatusOptions}
                series={visitStatusData}
                type="radialBar"
                height={320}
              />
            )}
          </Card>

          {/* Gender Distribution Chart */}
          <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow duration-300 bg-gradient-to-br from-white to-gray-50/30">
            <h3 className="text-base font-semibold mb-4 flex items-center gap-2 text-gray-700">
              <Users className="w-5 h-5 text-pink-500" />
              Gender Distribution
            </h3>
            {isLoading && !USE_DEMO_DATA ? (
              <div className="h-[320px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <Chart
                options={genderDistributionOptions}
                series={[
                  {
                    name: 'Patients',
                    data: [
                      patientStats?.gender_distribution?.Male || 0,
                      patientStats?.gender_distribution?.Female || 0,
                      patientStats?.gender_distribution?.Other || 0,
                    ],
                  },
                ]}
                type="bar"
                height={320}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

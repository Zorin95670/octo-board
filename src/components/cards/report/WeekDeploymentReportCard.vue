<template>
  <v-card v-if="chartData.datasets != null">
    <v-card-title>Deployments map time</v-card-title>
    <v-card-text>
      <div
        class="d-flex flex-column align-center justify-center"
        v-if="globalLoading || loading">
        <v-progress-circular
          :size="50"
          class="mb-5"
          color="primary"
          indeterminate
        ></v-progress-circular>
        Loading data...
      </div>
      <vue-chart
        type="bubble"
        :data="chartData"
        :width="800"
        :height="600"
        :options="config"
        v-else/>
    </v-card-text>
  </v-card>
</template>

<script>
import ChartConfig from '@/assets/reports/week-deployment-report.chart.config.json';

export default {
  name: 'WeekDeploymentReportCard',
  props: {
    globalLoading: Boolean,
    masterProjects: Array,
    environments: Array,
    clients: Array,
  },
  data() {
    const config = { ...ChartConfig };
    config.tooltips.callbacks.label = this.getTooltipLabel.bind(this);
    config.scales.xAxes[0].ticks.callback = this.getDayName.bind(this);
    config.scales.yAxes[0].ticks.callback = this.getHourFormat.bind(this);

    return {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      chartData: {
        datasets: null,
      },
      config,
      loading: true,
    };
  },
  methods: {
    setMasterProjectsParameters(params, selectedMasterProjects) {
      if (selectedMasterProjects.length === this.masterProjects.length) {
        return;
      }
      params.append('masterProject', selectedMasterProjects.join('|'));
    },
    setEnvironmentsParameters(params, selectedEnvironments) {
      if (selectedEnvironments.length === this.environments.length) {
        return;
      }
      params.append('environment', selectedEnvironments.join('|'));
    },
    setClientsParameters(params, selectedClients) {
      if (selectedClients.length === this.clients.length) {
        return;
      }
      params.append('client', selectedClients.join('|'));
    },
    reload(selectedMasterProjects, selectedEnvironments, selectedClients) {
      this.loading = true;
      const params = new URLSearchParams();
      params.append('fields', 'dayOfWeek');
      params.append('fields', 'masterProject');
      params.append('fields', 'hour');

      this.setMasterProjectsParameters(params, selectedMasterProjects);
      this.setEnvironmentsParameters(params, selectedEnvironments);
      this.setClientsParameters(params, selectedClients);

      return this.$http.get('/octo-spy/api/reports/deployments', { params })
        .then((response) => {
          const { data } = response;

          const counts = data.map((d) => parseInt(d.count, 10));
          const min = Math.min(...counts);
          const max = Math.max(...counts) - min;

          this.chartData.datasets = this.masterProjects
            .filter((masterProject) => data.some((d) => parseInt(d.masterProject, 10)
              === masterProject.id))
            .map((project) => ({
              label: project.name,
              fill: false,
              backgroundColor: `rgba(${project.color || '63,81,181'},0.5)`,
              borderColor: `rgb(${project.color || '63,81,181'})`,
              borderWidth: 3,
              data: data
                .filter((d) => parseInt(d.masterProject, 10) === project.id)
                .map((d) => ({
                  x: parseInt(d.dayOfWeek, 10),
                  y: parseInt(d.hour, 10),
                  r: this.r(max, parseInt(d.count, 10) - min),
                  count: parseInt(d.count, 10),
                })),
            }));
          this.loading = false;
        });
    },
    getTooltipLabel(context, values) {
      const data = values.datasets[context.datasetIndex].data[context.index];
      return `${data.count} deployments at ${data.y}H00 on ${this.getDayName(data.x)}.`;
    },
    getHourFormat(value) {
      return `${value}H00`;
    },
    getDayName(value) {
      return this.days[value];
    },
    r(max, value) {
      if (max === 0) {
        return 15;
      }
      return parseInt((15 * value) / max, 10) + 5;
    },
  },
};
</script>

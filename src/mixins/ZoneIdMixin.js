// export default {
//   props: ['zoneid'],
//   data: () => ({
//     resetPath: true,
//   }),
//   watch: {
//     'zoneid': function () {
//       if (this.zoneid) {
//         this.$store.commit('setZoneId', this.zoneid)
//       }
//     },
//     '$store.state.zone': function () {
//       if (this.$store.state.zone && this.resetPath) {
//         this.$router.push(`/${this.$route.path.split('/')[1]}/${this.$store.state.zone.id}`)
//       }
//     }
//   },
//   mounted () {
//     if (this.zoneid) {
//       this.$store.commit('setZoneId', this.zoneid)
//     }
//   }
// }
<template>
  <v-menu
    lazy
    :close-on-content-click="false"
    v-model="menu"
    transition="scale-transition"
    full-width
    :nudge-right="-40"
    max-width="290px"
    min-width="290px"
  >
    <v-text-field
      slot="activator"
      :label="label"
      v-model="localDate"
      prepend-icon="event"
      readonly
    ></v-text-field>
    <v-date-picker v-model="localDate" no-title scrollable actions :allowed-dates="allowedDates">
      <template scope="{ save, cancel }">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
          <v-btn flat color="primary" @click="save">OK</v-btn>
        </v-card-actions>
      </template>
    </v-date-picker>
  </v-menu>
</template>

<script>
import moment from 'moment'

export default {
  props: ['date', 'label', 'allowedDates', 'atTheEnd'],
  data: () => ({
    menu: false,
    localDate: this.date,
    
  }),
  watch: {
    localDate: function () {
      this.$emit('update:date', this.atTheEnd ? moment(this.localDate).endOf('day').format() : moment(this.localDate).format())
    }
  }
}
</script>

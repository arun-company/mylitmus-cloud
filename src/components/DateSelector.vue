<template>
  <v-menu
    :close-on-content-click="false"
    v-model="menu"
    transition="slide-y-transition"
    full-width
  >
    <v-text-field
      slot="activator"
      :label="label"
      v-model="localDate"
      prepend-icon="event"
    ></v-text-field>
    <!-- <v-date-picker v-model="localDate" no-title scrollable actions :allowed-dates="allowedDates">
      <template scope="{ save, cancel }">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
          <v-btn flat color="primary" @click="save">OK</v-btn>
        </v-card-actions>
      </template>
    </v-date-picker> -->
     <v-date-picker 
      locale="ko-kr"
       full-width
      v-model="localDate">
      </v-date-picker>
  </v-menu>
</template>

<script>
import moment from 'moment'

export default {
  props: ['date', 'label', 'allowedDates', 'atTheEnd','title-date-format'],
  data: () => ({
    menu: false,
    localDate: this.date,
    'title-date-format':'dd-mm-yy'
    
  }),
  watch: {
    localDate: function () {
      this.$emit('update:date', this.atTheEnd ? moment(this.localDate).endOf('day').format() : moment(this.localDate).format())
    }
  }
}
</script>

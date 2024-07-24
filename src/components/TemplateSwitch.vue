<template>
    <div class="text-center">
      <v-menu>
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <v-btn color="primary" v-bind="mergeProps(menu, tooltip)">
                Switch Templates
              </v-btn>
            </template>
            <span>Choose Template</span>
          </v-tooltip>
        </template>
        <v-list>
          <v-list-item v-for="(item, index) in items" :key="index">
            <v-list-item-title>
              <a class="link" :href="'/' + item.link">{{ item.title }}</a>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </template>
  
  <script>
  import { mergeProps } from 'vue'
  
  export default {
    data() {
      return {
        items: [
          { title: 'Resume Template 1', link: 'resume/1' },
          { title: 'Resume Template 2', link: 'resume/2' },
          { title: 'Resume Template 3', link: 'resume/3' },
          { title: 'Resume Template 4', link: 'resume/4' },
        ],
      }
    },
    methods: {
      mergeProps,
    },
  }
  </script>
  
  <style scoped>
  .link {
    text-decoration: none;
    color: inherit;
    transition: color 0.3s ease;
  }
  
  .link:hover {
    color: #1976d2; /* Vuetify primary color */
    text-decoration: underline;
  }
  </style>
  
<template>
  <table v-if="direction === 'vertical'" class="organization-chart-table vertical">
    <tbody>
      <tr class="row" data-section="row">
        <td :colspan="parentColspan">
          <div data-section="cell" class="organization-chart-node" @click="handleCellClick(data)">
            <span v-if="!hasLabelSlot">{{ data.label }}</span>
            <slot v-else name="label" :data="data"></slot>
            <div
              @click.stop="handleToggle(data)"
              class="organization-chart-expand-icon"
              :class="{ 'organization-chart-expand-icon-collapsed': !show }"
              v-if="data?.children?.length > 0"
            >
              <svg
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="15"
                height="15"
              >
                <path
                  d="M948.560332 281.179984c-13.765515-13.833053-36.127825-13.833053-49.89334 0L511.991302 668.591431 125.313565 281.179984c-13.763468-13.798261-36.093033-13.798261-49.856501 0-13.799284 13.798261-13.799284 36.161594 0 49.993624l410.857439 411.674037c7.067976 7.085372 16.402575 10.521634 25.675776 10.331299 9.274224 0.191358 18.608823-3.245927 25.677822-10.331299l410.891208-411.708829c6.863315-6.89913 10.331299-15.940041 10.331299-24.979928S955.423647 288.078091 948.560332 281.179984z"
                  fill="#707070"
                ></path>
              </svg>
            </div>
          </div>
        </td>
      </tr>
      <tr
        v-if="data?.children?.length > 0"
        :style="`visibility: ${show ? 'inherit' : 'hidden'}`"
        class="organization-chart-connectors"
        data-section="connectors"
      >
        <td :colspan="data.children.length * 2" data-section="line-cell">
          <div class="organization-chart-connector-down"></div>
        </td>
      </tr>
      <tr
        v-if="data?.children?.length > 1"
        :style="`visibility: ${show ? 'inherit' : 'hidden'}`"
        class="organization-chart-connectors"
        data-section="connectors"
      >
        <td
          v-for="horizontal in data.children.length * 2"
          :style="`width:${100 / (data.children.length * 2)}%; visibility: ${
            show ? 'inherit' : 'hidden'
          }`"
          :class="{
            'organization-chart-connector-left-radius': horizontal === 2,
            'organization-chart-connector-horizontal':
              horizontal > 1 && horizontal < data.children.length * 2 && horizontal % 2 === 1,
            'organization-chart-connector-top':
              horizontal > 1 && horizontal < data.children.length * 2,

            'organization-chart-connector-right-radius':
              horizontal === data.children.length * 2 - 1,
          }"
        ></td>
      </tr>
      <tr
        v-if="data?.children?.length > 0"
        :style="`visibility: ${show ? 'inherit' : 'hidden'}`"
        class="organization-chart-node-children"
        data-section="node-children"
      >
        <td
          v-for="node in data.children"
          :colspan="parentColspan / data.children.length"
          data-section="node-cell"
        >
          <OrgChart
            :data="node"
            v-on:cell-click="handleCellClick"
            v-on:expand="handleExpand"
            :direction="direction"
            :collapsible="collapsible"
          >
            <template #label v-if="hasLabelSlot">
              <slot name="label" :data="node"></slot>
            </template>
          </OrgChart>
        </td>
      </tr>
    </tbody>
  </table>
  <table v-if="direction === 'horizontal'" class="organization-chart-table horizontal">
    <tbody>
      <tr>
        <td v-if="isInit">
          <div data-section="cell" class="organization-chart-node" @click="handleCellClick(data)">
            {{ data?.label }}
          </div>
        </td>
        <td v-if="data?.children?.length > 0" style="position: relative">
          <tr>
            <td style="width: 24px" data-section="node-connector-line">
              <div
                data-section="connectors-line"
                :class="{ 'connectors-line': true }"
                class="node-connector-line"
                :data-visible="show"
              >
                &nbsp;
              </div>
              <div
                @click.stop="handleToggle(data)"
                class="organization-chart-expand-icon"
                :class="{ 'organization-chart-expand-icon-collapsed': !show }"
                v-if="data?.children?.length > 0"
              >
                <svg
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="15"
                  height="15"
                >
                  <path
                    d="M948.560332 281.179984c-13.765515-13.833053-36.127825-13.833053-49.89334 0L511.991302 668.591431 125.313565 281.179984c-13.763468-13.798261-36.093033-13.798261-49.856501 0-13.799284 13.798261-13.799284 36.161594 0 49.993624l410.857439 411.674037c7.067976 7.085372 16.402575 10.521634 25.675776 10.331299 9.274224 0.191358 18.608823-3.245927 25.677822-10.331299l410.891208-411.708829c6.863315-6.89913 10.331299-15.940041 10.331299-24.979928S955.423647 288.078091 948.560332 281.179984z"
                    fill="#707070"
                  ></path>
                </svg>
              </div>
            </td>
          </tr>
        </td>
        <td
          :style="`visibility: ${show ? 'inherit' : 'hidden'}`"
          v-if="data?.children?.length > 0"
          class="organization-chart-node-children"
        >
          <tr v-for="(item, index) in data.children">
            <td
              v-if="data?.children?.length > 1"
              style="position: relative; width: 24px"
              data-section="connectors"
            >
              <div
                data-section="connectors-line"
                :row-index="index"
                :class="{
                  'connectors-line': true,
                  'first-line': index === 0,
                  'middle-line': index > 0 && index < data.children.length - 1,
                  'last-line': index === data.children.length - 1,
                }"
              ></div>
            </td>
            <td data-section="cell">
              <div
                data-section="cell"
                class="organization-chart-node"
                @click="handleCellClick(item)"
              >
                {{ item.label }}
              </div>
            </td>
            <td class="organization-chart-node-children" v-if="item?.children?.length > 0">
              <OrgChart
                :data="item"
                v-on:cell-click="handleCellClick"
                v-on:expand="handleExpand"
                :isInit="false"
                :direction="direction"
                :collapsible="collapsible"
              >
                <template #label v-if="hasLabelSlot">
                  <slot name="label" :data="node"></slot>
                </template>
              </OrgChart>
            </td>
          </tr>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script setup name="OrgChart">
import { ref, defineProps, useSlots } from 'vue';

const emits = defineEmits(['cell-click', 'expand']);
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  direction: {
    type: String,
    default: 'vertical',
    validator: value => ['vertical', 'horizontal'].includes(value),
  },
  isInit: {
    type: Boolean,
    default: true,
  },
});
const show = ref(true);
const slots = useSlots();
const children = props.data?.children;
const parentColspan = children?.length > 0 ? children?.length * 2 : 1;

const hasLabelSlot = slots.label !== undefined;

const handleCellClick = data => {
  emits('cell-click', data);
};

const handleExpand = data => {
  emits('expand', data);
};

const handleToggle = nodeData => {
  show.value = !show.value;
  emits('expand', nodeData);
};
</script>
<script></script>
<style lang="scss" scoped>
$borderColor: #e2e8f0;
.organization-chart-table {
  border-spacing: 0;
  border-collapse: separate;
  font-size: 14px;
}
.organization-chart-node {
  display: inline-block;
  position: relative;
  color: #334155;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}
.organization-chart-expand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  cursor: pointer;
  width: 20px;
  left: 50%;
  height: 20px;
  background-color: #fff;
  transform: translate(-50%, 0);
  border-radius: 50%;
  border: 1px solid $borderColor;
}
.organization-chart-table {
  &.vertical {
    margin: 0 auto;
    & > tbody > tr > td {
      text-align: center;
      vertical-align: top;
      padding: 0 12px;
    }
    .organization-chart-expand-icon-collapsed {
      transform: translate(-50%, 0) rotate(180deg);
    }
    .organization-chart-connectors {
      height: 24px;
    }
    .organization-chart-connector-down {
      margin: 0 auto;
      height: 24px;
      width: 1px;
      background: $borderColor;
    }
    .organization-chart-connector-left-radius {
      border-top-left-radius: 6px;
      border-left: 1px solid $borderColor;
    }
    .organization-chart-connector-right-radius {
      border-top-right-radius: 6px;
      border-right: 1px solid $borderColor;
    }
    .organization-chart-connector-horizontal {
      border-right: 1px solid $borderColor;
    }
    .organization-chart-connector-top {
      border-top: 1px solid $borderColor;
    }
  }
}

.organization-chart-table {
  &.horizontal {
    td {
      padding: 0;
    }
    & > tbody > tr > td {
      text-align: center;
      vertical-align: middle;
    }
    .organization-chart-node {
      text-align: center;
      min-width: 100px;
      margin-bottom: 20px;
    }
    .organization-chart-connector-down {
      height: 100%;
      width: 24px;
      height: 1px;
      background-color: $borderColor;
      margin-bottom: 20px;
    }
    .connectors-line {
      position: absolute;
      &.first-line {
        left: 0;
        right: 0;
        top: calc(50% - 10px);
        bottom: 0;
        border-top: 1px solid $borderColor;
        border-left: 1px solid $borderColor;
      }
      &.middle-line {
        inset: 0;
        border-left: 1px solid $borderColor;
        &::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: calc(50% - 10px);
          bottom: 0;
          border-top: 1px solid $borderColor;
        }
      }
      &.last-line {
        left: 0;
        right: 0;
        top: 0;
        bottom: calc(50% + 10px);
        border-bottom: 1px solid $borderColor;
        border-left: 1px solid $borderColor;
      }
    }
    .node-connector-line {
      top: calc(50% - 10px);
      &[data-visible='true'] {
        border-top: 1px solid $borderColor;
      }
      width: 100%;
    }
    .organization-chart-expand-icon {
      transform: translate(-20px, -20px) rotate(270deg);
    }
    .organization-chart-expand-icon-collapsed {
      transform: translate(-20px, -20px) rotate(90deg);
    }
  }
}
</style>

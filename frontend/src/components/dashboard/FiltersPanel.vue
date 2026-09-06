<template>
  <BaseCard class="filters" :class="{ 'filters--collapsed': collapsed }">
    <template #title>
      <button type="button" class="filters__toggle" @click="collapsed = !collapsed">
        <span>
          <strong>Filters</strong>
          <small>Refine the dataset</small>
        </span>
        <BaseIcon name="chevronDown" :size="16" class="filters__chevron" />
      </button>
    </template>

    <div v-show="!collapsed" class="filters__body">
      <div class="filters__group">
        <BaseSelect
          v-model="local.period"
          label="Period"
          :options="PERIOD_OPTIONS"
          :disabled="loading"
        />
        <BaseSelect
          v-model="local.region"
          label="Region"
          :options="REGION_OPTIONS"
          :disabled="loading"
        />
        <BaseSelect
          v-model="local.segment"
          label="Segment"
          :options="SEGMENT_OPTIONS"
          :disabled="loading"
        />
      </div>

      <div class="filters__actions">
        <BaseButton variant="primary" :loading="loading" :disabled="!isDirty" @click="apply">
          Apply filters
        </BaseButton>
        <BaseButton variant="ghost" :disabled="loading || isDefault" @click="reset">
          Reset
        </BaseButton>
      </div>

      <p v-if="isDirty" class="filters__hint">You have unapplied filter changes.</p>
      <p v-if="lastUpdated" class="filters__meta">Updated {{ relativeUpdated }}</p>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import BaseCard from "../ui/BaseCard.vue";
import BaseSelect from "../ui/BaseSelect.vue";
import BaseButton from "../ui/BaseButton.vue";
import BaseIcon from "../ui/BaseIcon.vue";
import {
  DEFAULT_FILTERS,
  PERIOD_OPTIONS,
  REGION_OPTIONS,
  SEGMENT_OPTIONS
} from "../../constants/filters.js";

const props = defineProps({
  filters: { type: Object, required: true },
  loading: { type: Boolean, default: false },
  lastUpdated: { type: String, default: "" }
});

const emit = defineEmits(["apply", "reset"]);

const local = reactive({ ...props.filters });
const collapsed = ref(false);
const nowTick = ref(Date.now());
let ticker;

watch(
  () => props.filters,
  (next) => {
    local.period = next.period;
    local.region = next.region;
    local.segment = next.segment;
  },
  { deep: true }
);

const isDirty = computed(
  () =>
    local.period !== props.filters.period ||
    local.region !== props.filters.region ||
    local.segment !== props.filters.segment
);

const isDefault = computed(
  () =>
    props.filters.period === DEFAULT_FILTERS.period &&
    props.filters.region === DEFAULT_FILTERS.region &&
    props.filters.segment === DEFAULT_FILTERS.segment &&
    !isDirty.value
);

const apply = () => emit("apply", { ...local });
const reset = () => emit("reset");

const relativeUpdated = computed(() => {
  if (!props.lastUpdated) return "";
  const diffSec = Math.max(0, Math.round((nowTick.value - new Date(props.lastUpdated).getTime()) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  return `${diffHr}h ago`;
});

function syncCollapsedToViewport() {
  collapsed.value = window.matchMedia("(max-width: 1180px)").matches;
}

onMounted(() => {
  syncCollapsedToViewport();
  window.addEventListener("resize", syncCollapsedToViewport);
  ticker = setInterval(() => {
    nowTick.value = Date.now();
  }, 1000);
});

onUnmounted(() => {
  window.removeEventListener("resize", syncCollapsedToViewport);
  if (ticker) clearInterval(ticker);
});
</script>

<style scoped>
.filters {
  position: sticky;
  top: 12px;
  align-self: start;
}

.filters__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: none;
  background: transparent;
  padding: 0;
  text-align: left;
  font-family: inherit;
  color: inherit;
  cursor: default;
  pointer-events: none;
}

.filters__toggle strong {
  display: block;
  font-size: 16px;
  font-weight: var(--font-weight-header);
  color: var(--color-text);
}

.filters__toggle small {
  display: block;
  margin-top: 2px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.filters__chevron {
  display: none;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.filters__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.filters__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: var(--space-6);
}

.filters__hint {
  margin-top: var(--space-3);
  font-size: 12px;
  color: var(--color-warning);
}

.filters__meta {
  margin-top: var(--space-4);
  font-size: 12px;
  color: var(--color-text-subtle);
}

@media (max-width: 1180px) {
  .filters {
    position: static;
    width: 100%;
  }

  .filters__toggle {
    cursor: pointer;
    pointer-events: auto;
    min-height: 44px;
  }

  .filters__chevron {
    display: block;
  }

  .filters--collapsed .filters__chevron {
    transform: rotate(-90deg);
  }

  .filters--collapsed :deep(.card__body) {
    display: none;
  }

  .filters__group {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-4);
  }
}

@media (max-width: 720px) {
  .filters__group {
    grid-template-columns: 1fr;
  }

  .filters__actions {
    flex-direction: column;
  }

  .filters__actions :deep(.btn) {
    width: 100%;
  }
}
</style>

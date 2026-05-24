import { Pressable, ScrollView, Text, View } from 'react-native';

import type { INTERVIEW_COPY } from '../constants';
import type { InterviewScenario, InterviewScenarioId } from '../types';

type InterviewCopy = typeof INTERVIEW_COPY;

type ScenarioPickerProps = {
  copy: InterviewCopy;
  scenarios: InterviewScenario[];
  activeScenarioId: InterviewScenarioId | null;
  disabled: boolean;
  onSelect: (id: InterviewScenarioId) => void;
};

export function ScenarioPicker({
  copy,
  scenarios,
  activeScenarioId,
  disabled,
  onSelect,
}: ScenarioPickerProps) {
  return (
    <View className="border-b border-neutral-800 px-5 py-3">
      <Text className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {copy.scenarioLabel}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {scenarios.map((scenario) => {
          const isActive = scenario.id === activeScenarioId;
          return (
            <Pressable
              key={scenario.id}
              onPress={() => onSelect(scenario.id)}
              disabled={disabled}
              className={`mr-2 rounded-xl border px-3 py-2 active:opacity-80 ${
                isActive
                  ? 'border-blue-500/60 bg-blue-950/50'
                  : 'border-neutral-800 bg-neutral-900'
              } ${disabled ? 'opacity-60' : ''}`}>
              <Text
                className={`text-sm font-semibold ${isActive ? 'text-blue-300' : 'text-neutral-200'}`}>
                {scenario.label}
              </Text>
              <Text className="mt-0.5 max-w-[140px] text-xs text-neutral-500">
                {scenario.description}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

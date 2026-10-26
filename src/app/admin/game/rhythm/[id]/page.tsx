import RhythmChartEditorClient from './RhythmChartEditorClient';

export default async function AdminRhythmChartEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RhythmChartEditorClient id={id} />;
}

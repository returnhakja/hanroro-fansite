'use client';

import { useState, useMemo } from 'react';
import { useActivities } from '@/hooks/queries/useActivities';
import type { Activity } from '@/hooks/queries/useActivities';
import {
  Container,
  PageHeader,
  PageTitle,
  PageSubtitle,
  YearTabList,
  YearTab,
  Timeline,
  MonthGroup,
  MonthLabel,
  MonthText,
  MonthDot,
  ActivityList,
  ActivityCard,
  CardImage,
  CardBody,
  CardTop,
  TypeBadge,
  CardTitle,
  CardDescription,
  CardLink,
  EmptyMessage,
} from './Chronicle.styles';

const TYPE_LABEL: Record<string, string> = {
  concert: '공연',
  release: '음원/앨범',
  broadcast: '방송',
  award: '시상식',
  etc: '기타',
};

const MONTH_KR = [
  '', '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

export default function ChronicleClient() {
  const { data: activities = [], isLoading } = useActivities();

  const years = useMemo(() => {
    const set = new Set(activities.map((a) => a.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [activities]);

  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const activeYear = selectedYear ?? years[0] ?? null;

  const groupedByMonth = useMemo(() => {
    const filtered = activities.filter((a) => a.year === activeYear);
    const map = new Map<number, Activity[]>();
    filtered.forEach((a) => {
      if (!map.has(a.month)) map.set(a.month, []);
      map.get(a.month)!.push(a);
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [activities, activeYear]);

  return (
    <Container>
      <PageHeader>
        <PageTitle>연대기</PageTitle>
        <PageSubtitle>한로로의 발자취를 연도별로 돌아보세요</PageSubtitle>
      </PageHeader>

      {isLoading ? (
        <EmptyMessage>로딩 중...</EmptyMessage>
      ) : years.length === 0 ? (
        <EmptyMessage>등록된 활동이 없습니다</EmptyMessage>
      ) : (
        <>
          <YearTabList>
            {years.map((year) => (
              <YearTab
                key={year}
                $active={year === activeYear}
                onClick={() => setSelectedYear(year)}
              >
                {year}
              </YearTab>
            ))}
          </YearTabList>

          <Timeline>
            {groupedByMonth.map(([month, items]) => (
              <MonthGroup key={month}>
                <MonthLabel>
                  <MonthText>{MONTH_KR[month]}</MonthText>
                  <MonthDot />
                </MonthLabel>
                <ActivityList>
                  {items.map((activity, idx) => (
                    <ActivityCard
                      key={activity._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.06 }}
                    >
                      {activity.imageUrl && (
                        <CardImage $url={activity.imageUrl} />
                      )}
                      <CardBody>
                        <CardTop>
                          <TypeBadge $type={activity.type}>
                            {TYPE_LABEL[activity.type] ?? activity.type}
                          </TypeBadge>
                        </CardTop>
                        <CardTitle>{activity.title}</CardTitle>
                        {activity.description && (
                          <CardDescription>{activity.description}</CardDescription>
                        )}
                        {activity.link && (
                          <CardLink
                            href={activity.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            자세히 보기 →
                          </CardLink>
                        )}
                      </CardBody>
                    </ActivityCard>
                  ))}
                </ActivityList>
              </MonthGroup>
            ))}
          </Timeline>
        </>
      )}
    </Container>
  );
}

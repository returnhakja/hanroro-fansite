'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
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
  MoreButton,
  CardLink,
  EmptyMessage,
} from './Chronicle.styles';

// 글자수 기준(대략치)이 아니라, 실제로 2줄 안에 다 들어가는지 브라우저가
// 계산한 결과(scrollHeight > clientHeight)로 "더보기" 버튼 노출 여부를 정한다.
// PC처럼 카드 폭이 넓어 2줄 안에 다 들어갈 땐 버튼이 뜨지 않는다.
function ClampedDescription({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || expanded) return;

    const checkOverflow = () => {
      setOverflowing(el.scrollHeight > el.clientHeight + 1);
    };

    checkOverflow();

    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, expanded]);

  return (
    <>
      <CardDescription ref={ref} $expanded={expanded}>
        {text}
      </CardDescription>
      {(overflowing || expanded) && (
        <MoreButton type="button" onClick={() => setExpanded((prev) => !prev)}>
          {expanded ? '접기' : '더보기'}
        </MoreButton>
      )}
    </>
  );
}

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
    return Array.from(map.entries()).sort(([a], [b]) => b - a);
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
                          <ClampedDescription text={activity.description} />
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

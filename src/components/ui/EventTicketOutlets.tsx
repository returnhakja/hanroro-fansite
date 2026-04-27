"use client";

import styled from "styled-components";
import { theme } from "@/styles/theme";
import type { TicketOutlet } from "@/types/api/event";

function sortTicketOutlets(outlets: TicketOutlet[]): TicketOutlet[] {
  return [...outlets].sort(
    (a, b) => Number(!!b.isPrimary) - Number(!!a.isPrimary),
  );
}

const TicketSection = styled.div`
  margin-top: ${theme.spacing.gap.md};
  padding-top: ${theme.spacing.gap.md};
  border-top: 1px solid ${theme.colors.borderLight};
`;

const TicketSectionTitle = styled.div`
  font-size: ${theme.typography.small.fontSize};
  color: ${theme.colors.textPrimary};
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const TicketOutletStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const TicketOutletItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const TicketOutletLink = styled.a<{ $primary?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0.625rem 1rem;
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.typography.small.fontSize};
  font-weight: 600;
  text-decoration: none;
  color: ${theme.colors.textLight};
  box-sizing: border-box;
  transition:
    opacity ${theme.transitions.fast},
    transform ${theme.transitions.fast};
  background: ${(props) =>
    props.$primary
      ? `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.accentDark} 100%)`
      : `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%)`};
  box-shadow: ${(props) =>
    props.$primary ? theme.shadows.md : theme.shadows.sm};

  &:hover {
    opacity: 0.95;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 2px;
  }
`;

const TicketOutletMeta = styled.div`
  font-size: 0.75rem;
  color: ${theme.colors.textTertiary};
  line-height: 1.4;
  padding: 0 0.125rem;
  overflow: hidden;
  text-overflow: ellipsis;
`;

type Props = {
  outlets: TicketOutlet[] | undefined;
  idPrefix?: string;
};

export function EventTicketOutlets({ outlets, idPrefix = "outlet" }: Props) {
  const list = sortTicketOutlets(outlets ?? []);
  if (list.length === 0) return null;

  return (
    <TicketSection>
      <TicketSectionTitle>예매</TicketSectionTitle>
      <TicketOutletStack>
        {list.map((o, oi) => (
          <TicketOutletItem key={`${idPrefix}-${oi}-${o.url}`}>
            <TicketOutletLink
              href={o.url}
              target="_blank"
              rel="noopener noreferrer"
              $primary={o.isPrimary === true}
              aria-label={`${o.label} 예매 페이지 (새 창)`}
            >
              {o.label}
            </TicketOutletLink>
            {(o.opensAt || o.note) && (
              <TicketOutletMeta>
                {[o.opensAt, o.note].filter(Boolean).join(" · ")}
              </TicketOutletMeta>
            )}
          </TicketOutletItem>
        ))}
      </TicketOutletStack>
    </TicketSection>
  );
}

import React, { ReactNode, FC } from "react";
import Image from "next/image";
import {
  AbilityDetail,
  AggressiveStats,
  DefensiveStats,
  StratagemInfo,
  UnitCardDetails,
  WeaponDetail,
} from "../types";

export const Card = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      border: "2px solid black",
      width: "7.4cm",
      height: "10.5cm",
      padding: 16,
      display: "flex",
      flexDirection: "column",
    }}
  >
    {children}
  </div>
);

const Stratagem = ({ name, phase, CP, text }: StratagemInfo) => (
  <div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid black",
        paddingBottom: 8,
      }}
    >
      <h2 style={{ fontSize: "14px" }}>{name}</h2>
      <div
        style={{
          borderRadius: "50%",
          border: "1px solid black",
          width: 24,
          height: 24,
          textAlign: "center",
          lineHeight: "22px",
        }}
      >
        {CP}
      </div>
    </div>
    <div style={{ fontSize: 12, borderBottom: "1px solid black" }}>
      <i>{phase}</i>
    </div>
    <div style={{ paddingTop: 8, fontSize: 12 }}>{text}</div>
  </div>
);

export const StratagemCard = ({
  stratagems,
}: {
  stratagems: StratagemInfo[];
}) => (
  <Card>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
      }}
    >
      {stratagems.map((strat) => (
        <Stratagem key={strat.name} {...strat} />
      ))}
    </div>
  </Card>
);

export const UnitCard = ({
  name,
  keywords,
  gear,
  weapons,
  abilities,
  role,
  stats,
}) => {
  return (
    <Card>
      {/* <CardTop name={name} {...aggressiveStats} /> */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid black",
          paddingBottom: 8,
        }}
      >
        <Image
          src={`/${role}.svg`}
          alt="Landscape picture"
          height={28}
          width={28}
        />
        <h2 style={{ fontSize: "14px" }}>{name}</h2>
      </div>
      {keywords && (
        <div style={{ fontSize: 12, borderBottom: "1px solid black" }}>
          <i>{keywords.map(({ name }) => name).join(", ")}</i>
        </div>
      )}
      {gear && (
        <div
          style={{
            fontSize: "12px",
            lineHeight: "14px",
            borderBottom: "1px solid black",
            paddingBottom: 8,
            paddingTop: 8,
          }}
        >
          <b>Gear:</b> {gear}
        </div>
      )}
      {weapons && (
        <div
          style={{
            fontSize: "12px",
            lineHeight: "14px",
            borderBottom: "1px solid black",
            paddingBottom: 8,
          }}
        >
          {weapons.map((props) => (
            <Weapon key={props.name} {...props} />
          ))}
        </div>
      )}
      {abilities &&
        abilities.map((props) => <Ability key={props.name} {...props} />)}
      <AllStats {...stats} />
    </Card>
  );
};

const Weapon = ({ name, profile, notes }) => (
  <div style={{ paddingTop: 8 }}>
    <div>{profile}</div>
    {notes && <div style={{ paddingLeft: 4 }}>{notes}</div>}
  </div>
);
export const Ability = ({ name, details }: AbilityDetail) => (
  <div style={{ paddingTop: 8, fontSize: 12 }}>
    <b>{name}:</b> {details}
  </div>
);

const Defence = ({ T, W, Ld, Sv }: DefensiveStats) => (
  <StatWrapper
    style={{
      marginLeft: "auto",
      marginTop: "auto",
      borderTop: "1px solid black",
      paddingTop: 8,
      paddingLeft: 8,
      borderLeft: "1px solid black",
    }}
  >
    <Stat top="T" bottom={T} />
    <Stat top="W" bottom={W} />
    <Stat top="Ld" bottom={Ld} />
    <Stat top="Sv" bottom={Sv} />
  </StatWrapper>
);

const Stat = ({ top, bottom }: { top: string; bottom: string }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <div style={{ fontSize: 10 }}>
      <b>{top}</b>
    </div>
    <div>{bottom}</div>
  </div>
);

const StatWrapper = ({
  children,
  style,
}: {
  children: ReactNode;
  style: React.CSSProperties;
}) => (
  <div
    style={{
      display: "flex",
      gap: 6,
      textAlign: "center",

      ...style,
    }}
  >
    {children}
  </div>
);

const Stats = ({ M, WS, BS, S, A }: AggressiveStats) => (
  <StatWrapper style={{ borderLeft: "1px solid black", paddingLeft: 8 }}>
    <Stat top="M" bottom={M} />
    <Stat top="WS" bottom={WS} />
    <Stat top="BS" bottom={BS} />
    <Stat top="S" bottom={S} />
    <Stat top="A" bottom={A} />
  </StatWrapper>
);

const AllStats = ({
  M,
  WS,
  BS,
  S,
  A,
  T,
  W,
  Ld,
  Sv,
}: AggressiveStats & DefensiveStats) => {
  return (
    <StatWrapper
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "auto",
        borderTop: "1px solid black",
        paddingTop: 8,
      }}
    >
      <Stat top="M" bottom={M} />
      <Stat top="WS" bottom={WS} />
      <Stat top="BS" bottom={BS} />
      <Stat top="S" bottom={S} />
      <Stat top="A" bottom={A} />
      <Stat top="T" bottom={T} />
      <Stat top="W" bottom={W} />
      <Stat top="Ld" bottom={Ld} />
      <Stat top="Sv" bottom={Sv} />
    </StatWrapper>
  );
};

export const LinedCard: FC<{ lines?: number }> = ({ children, lines = 15 }) => (
  <Card>
    {children}
    {new Array(lines).fill(1).map((_, i) => (
      <div key={i} style={{ borderBottom: "1px solid black" }}>
        :
      </div>
    ))}
  </Card>
);

export const OptionsCard = ({
  abilities,
  title,
}: {
  abilities: AbilityDetail[];
  title: string;
}) => (
  <Card>
    <div>{title}</div>
    <div
      style={{
        display: "flex",
        justifyContent: "space-around",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {abilities.map((ability) => (
        <div
          key={ability.name}
          style={{ display: "flex", alignItems: "flex-start", gap: 6 }}
        >
          <input type="checkbox" style={{ marginTop: 10 }} />
          <Ability {...ability} />
        </div>
      ))}
    </div>
  </Card>
);

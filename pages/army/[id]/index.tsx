import type { NextPage } from "next";
import { gql } from "@ts-gql/tag/no-transform";
import { useQuery } from "@ts-gql/apollo";
import { UnitCard, Card } from "../../../components/cards";
import { useRouter } from "next/router";
import {
  NecronRules,
  NecronStratagems,
  PageWrapper,
  PrimaryCard,
  PrintSeparator,
} from "../../scratchings";

const fragment = gql`
  fragment All_Stats on UnitStat {
    M
    WS
    BS
    W
    S
    T
    A
    Sv
    Ld
    statLine
    id
  }
` as import("../../../__generated__/ts-gql/All_Stats").type;

export const armyQuery = gql`
  query ArmyView($id: ID!) {
    armyList(where: { id: $id }) {
      name
      id
      units {
        name
        id
        role
        points
        stats {
          M
          WS
          BS
          W
          S
          T
          A
          Sv
          Ld
          statLine
          id
        }
        weapons {
          id
          name
          range
          type
          shots
          AP
          dmg
          strength
          notes
          profile
        }
        keywords {
          name
          id
        }
        points
        abilities {
          name
          id
          details
        }
      }
    }
  }
` as import("../../../__generated__/ts-gql/ArmyView").type;

const Home: NextPage = () => {
  const router = useRouter();

  const { data, error, loading } = useQuery(armyQuery, {
    variables: {
      id: router.query.id! as string,
    },
  });

  if (loading) {
    return <div>Loading</div>;
  }

  console.log(data?.armyList);

  return (
    <PageWrapper>
      {data?.armyList?.units?.map((unit) => (
        // @ts-ignore
        <UnitCard {...unit} key={unit.name} />
      ))}
      <Card>
        <h2 style={{ textAlign: "center", fontSize: "14px" }}>Turn Help</h2>
        <div style={{ fontSize: 12 }}>
          <div style={{ fontSize: 14 }}>Command Phase</div>
          <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
            <div>chronometron</div>
            <div>My will be Done</div>
            <div>Resurrection Orb</div>
          </div>

          <div style={{ fontSize: 14 }}>Movement Phase</div>
          <div style={{ paddingLeft: 16, paddingBottom: 8 }}>
            <div>Veil of Darkness</div>
          </div>
        </div>
      </Card>
      <PrimaryCard player1="Noviny" player2="Tom" />
      <PrintSeparator />
      <NecronRules />
      <Card>{}</Card>
      <PrintSeparator />
      <NecronStratagems />
    </PageWrapper>
  );
};

export default Home;

// ts-gql-integrity:04f94226b0312f945b649ca9449c6bab
/*
ts-gql-meta-begin
{
  "hash": "95561f1aa3cbef5be8d5c6b00f9754de"
}
ts-gql-meta-end
*/
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
};

export type WeaponProfile = {
  readonly __typename: 'WeaponProfile';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly range: Maybe<Scalars['String']>;
  readonly type: Maybe<Scalars['String']>;
  readonly shots: Maybe<Scalars['String']>;
  readonly AP: Maybe<Scalars['String']>;
  readonly dmg: Maybe<Scalars['String']>;
  readonly strength: Maybe<Scalars['String']>;
  readonly notes: Maybe<Scalars['String']>;
  readonly profile: Maybe<Scalars['String']>;
  readonly units: Maybe<ReadonlyArray<Unit>>;
  readonly unitsCount: Maybe<Scalars['Int']>;
};


export type WeaponProfileunitsArgs = {
  where?: UnitWhereInput;
  orderBy?: ReadonlyArray<UnitOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type WeaponProfileunitsCountArgs = {
  where?: UnitWhereInput;
};

export type WeaponProfileWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
  readonly name?: Maybe<Scalars['String']>;
};

export type WeaponProfileWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<WeaponProfileWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<WeaponProfileWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<WeaponProfileWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
  readonly range?: Maybe<StringFilter>;
  readonly type?: Maybe<StringFilter>;
  readonly shots?: Maybe<StringFilter>;
  readonly AP?: Maybe<StringFilter>;
  readonly dmg?: Maybe<StringFilter>;
  readonly strength?: Maybe<StringFilter>;
  readonly notes?: Maybe<StringFilter>;
  readonly units?: Maybe<UnitManyRelationFilter>;
};

export type IDFilter = {
  readonly equals?: Maybe<Scalars['ID']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['ID']>>;
  readonly lt?: Maybe<Scalars['ID']>;
  readonly lte?: Maybe<Scalars['ID']>;
  readonly gt?: Maybe<Scalars['ID']>;
  readonly gte?: Maybe<Scalars['ID']>;
  readonly not?: Maybe<IDFilter>;
};

export type StringFilter = {
  readonly equals?: Maybe<Scalars['String']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly lt?: Maybe<Scalars['String']>;
  readonly lte?: Maybe<Scalars['String']>;
  readonly gt?: Maybe<Scalars['String']>;
  readonly gte?: Maybe<Scalars['String']>;
  readonly contains?: Maybe<Scalars['String']>;
  readonly startsWith?: Maybe<Scalars['String']>;
  readonly endsWith?: Maybe<Scalars['String']>;
  readonly mode?: Maybe<QueryMode>;
  readonly not?: Maybe<NestedStringFilter>;
};

export type QueryMode =
  | 'default'
  | 'insensitive';

export type NestedStringFilter = {
  readonly equals?: Maybe<Scalars['String']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['String']>>;
  readonly lt?: Maybe<Scalars['String']>;
  readonly lte?: Maybe<Scalars['String']>;
  readonly gt?: Maybe<Scalars['String']>;
  readonly gte?: Maybe<Scalars['String']>;
  readonly contains?: Maybe<Scalars['String']>;
  readonly startsWith?: Maybe<Scalars['String']>;
  readonly endsWith?: Maybe<Scalars['String']>;
  readonly not?: Maybe<NestedStringFilter>;
};

export type UnitManyRelationFilter = {
  readonly every?: Maybe<UnitWhereInput>;
  readonly some?: Maybe<UnitWhereInput>;
  readonly none?: Maybe<UnitWhereInput>;
};

export type WeaponProfileOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
  readonly range?: Maybe<OrderDirection>;
  readonly type?: Maybe<OrderDirection>;
  readonly shots?: Maybe<OrderDirection>;
  readonly AP?: Maybe<OrderDirection>;
  readonly dmg?: Maybe<OrderDirection>;
  readonly strength?: Maybe<OrderDirection>;
  readonly notes?: Maybe<OrderDirection>;
};

export type OrderDirection =
  | 'asc'
  | 'desc';

export type WeaponProfileUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly range?: Maybe<Scalars['String']>;
  readonly type?: Maybe<Scalars['String']>;
  readonly shots?: Maybe<Scalars['String']>;
  readonly AP?: Maybe<Scalars['String']>;
  readonly dmg?: Maybe<Scalars['String']>;
  readonly strength?: Maybe<Scalars['String']>;
  readonly notes?: Maybe<Scalars['String']>;
  readonly units?: Maybe<UnitRelateToManyForUpdateInput>;
};

export type UnitRelateToManyForUpdateInput = {
  readonly disconnect?: Maybe<ReadonlyArray<UnitWhereUniqueInput>>;
  readonly set?: Maybe<ReadonlyArray<UnitWhereUniqueInput>>;
  readonly create?: Maybe<ReadonlyArray<UnitCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<UnitWhereUniqueInput>>;
};

export type WeaponProfileUpdateArgs = {
  readonly where: WeaponProfileWhereUniqueInput;
  readonly data: WeaponProfileUpdateInput;
};

export type WeaponProfileCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly range?: Maybe<Scalars['String']>;
  readonly type?: Maybe<Scalars['String']>;
  readonly shots?: Maybe<Scalars['String']>;
  readonly AP?: Maybe<Scalars['String']>;
  readonly dmg?: Maybe<Scalars['String']>;
  readonly strength?: Maybe<Scalars['String']>;
  readonly notes?: Maybe<Scalars['String']>;
  readonly units?: Maybe<UnitRelateToManyForCreateInput>;
};

export type UnitRelateToManyForCreateInput = {
  readonly create?: Maybe<ReadonlyArray<UnitCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<UnitWhereUniqueInput>>;
};

export type UnitStat = {
  readonly __typename: 'UnitStat';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly M: Maybe<Scalars['String']>;
  readonly WS: Maybe<Scalars['String']>;
  readonly BS: Maybe<Scalars['String']>;
  readonly S: Maybe<Scalars['String']>;
  readonly A: Maybe<Scalars['String']>;
  readonly statLine: Maybe<Scalars['String']>;
  readonly units: Maybe<ReadonlyArray<Unit>>;
  readonly unitsCount: Maybe<Scalars['Int']>;
};


export type UnitStatunitsArgs = {
  where?: UnitWhereInput;
  orderBy?: ReadonlyArray<UnitOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type UnitStatunitsCountArgs = {
  where?: UnitWhereInput;
};

export type UnitStatWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
  readonly name?: Maybe<Scalars['String']>;
};

export type UnitStatWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<UnitStatWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<UnitStatWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<UnitStatWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
  readonly M?: Maybe<StringFilter>;
  readonly WS?: Maybe<StringFilter>;
  readonly BS?: Maybe<StringFilter>;
  readonly S?: Maybe<StringFilter>;
  readonly A?: Maybe<StringFilter>;
  readonly units?: Maybe<UnitManyRelationFilter>;
};

export type UnitStatOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
  readonly M?: Maybe<OrderDirection>;
  readonly WS?: Maybe<OrderDirection>;
  readonly BS?: Maybe<OrderDirection>;
  readonly S?: Maybe<OrderDirection>;
  readonly A?: Maybe<OrderDirection>;
};

export type UnitStatUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly M?: Maybe<Scalars['String']>;
  readonly WS?: Maybe<Scalars['String']>;
  readonly BS?: Maybe<Scalars['String']>;
  readonly S?: Maybe<Scalars['String']>;
  readonly A?: Maybe<Scalars['String']>;
  readonly units?: Maybe<UnitRelateToManyForUpdateInput>;
};

export type UnitStatUpdateArgs = {
  readonly where: UnitStatWhereUniqueInput;
  readonly data: UnitStatUpdateInput;
};

export type UnitStatCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly M?: Maybe<Scalars['String']>;
  readonly WS?: Maybe<Scalars['String']>;
  readonly BS?: Maybe<Scalars['String']>;
  readonly S?: Maybe<Scalars['String']>;
  readonly A?: Maybe<Scalars['String']>;
  readonly units?: Maybe<UnitRelateToManyForCreateInput>;
};

export type Unit = {
  readonly __typename: 'Unit';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly details: Maybe<Scalars['String']>;
  readonly stats: Maybe<UnitStat>;
  readonly weapons: Maybe<ReadonlyArray<WeaponProfile>>;
  readonly weaponsCount: Maybe<Scalars['Int']>;
  readonly keywords: Maybe<ReadonlyArray<Tag>>;
  readonly keywordsCount: Maybe<Scalars['Int']>;
  readonly points: Maybe<Scalars['Int']>;
  readonly abilities: Maybe<ReadonlyArray<Rule>>;
  readonly abilitiesCount: Maybe<Scalars['Int']>;
  readonly role: Maybe<Scalars['String']>;
};


export type UnitweaponsArgs = {
  where?: WeaponProfileWhereInput;
  orderBy?: ReadonlyArray<WeaponProfileOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type UnitweaponsCountArgs = {
  where?: WeaponProfileWhereInput;
};


export type UnitkeywordsArgs = {
  where?: TagWhereInput;
  orderBy?: ReadonlyArray<TagOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type UnitkeywordsCountArgs = {
  where?: TagWhereInput;
};


export type UnitabilitiesArgs = {
  where?: RuleWhereInput;
  orderBy?: ReadonlyArray<RuleOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type UnitabilitiesCountArgs = {
  where?: RuleWhereInput;
};

export type UnitWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
  readonly name?: Maybe<Scalars['String']>;
};

export type UnitWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<UnitWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<UnitWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<UnitWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
  readonly details?: Maybe<StringFilter>;
  readonly stats?: Maybe<UnitStatWhereInput>;
  readonly weapons?: Maybe<WeaponProfileManyRelationFilter>;
  readonly keywords?: Maybe<TagManyRelationFilter>;
  readonly points?: Maybe<IntFilter>;
  readonly abilities?: Maybe<RuleManyRelationFilter>;
  readonly role?: Maybe<StringFilter>;
};

export type WeaponProfileManyRelationFilter = {
  readonly every?: Maybe<WeaponProfileWhereInput>;
  readonly some?: Maybe<WeaponProfileWhereInput>;
  readonly none?: Maybe<WeaponProfileWhereInput>;
};

export type TagManyRelationFilter = {
  readonly every?: Maybe<TagWhereInput>;
  readonly some?: Maybe<TagWhereInput>;
  readonly none?: Maybe<TagWhereInput>;
};

export type IntFilter = {
  readonly equals?: Maybe<Scalars['Int']>;
  readonly in?: Maybe<ReadonlyArray<Scalars['Int']>>;
  readonly notIn?: Maybe<ReadonlyArray<Scalars['Int']>>;
  readonly lt?: Maybe<Scalars['Int']>;
  readonly lte?: Maybe<Scalars['Int']>;
  readonly gt?: Maybe<Scalars['Int']>;
  readonly gte?: Maybe<Scalars['Int']>;
  readonly not?: Maybe<IntFilter>;
};

export type RuleManyRelationFilter = {
  readonly every?: Maybe<RuleWhereInput>;
  readonly some?: Maybe<RuleWhereInput>;
  readonly none?: Maybe<RuleWhereInput>;
};

export type UnitOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
  readonly details?: Maybe<OrderDirection>;
  readonly points?: Maybe<OrderDirection>;
  readonly role?: Maybe<OrderDirection>;
};

export type UnitUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly details?: Maybe<Scalars['String']>;
  readonly stats?: Maybe<UnitStatRelateToOneForUpdateInput>;
  readonly weapons?: Maybe<WeaponProfileRelateToManyForUpdateInput>;
  readonly keywords?: Maybe<TagRelateToManyForUpdateInput>;
  readonly points?: Maybe<Scalars['Int']>;
  readonly abilities?: Maybe<RuleRelateToManyForUpdateInput>;
  readonly role?: Maybe<Scalars['String']>;
};

export type UnitStatRelateToOneForUpdateInput = {
  readonly create?: Maybe<UnitStatCreateInput>;
  readonly connect?: Maybe<UnitStatWhereUniqueInput>;
  readonly disconnect?: Maybe<Scalars['Boolean']>;
};

export type WeaponProfileRelateToManyForUpdateInput = {
  readonly disconnect?: Maybe<ReadonlyArray<WeaponProfileWhereUniqueInput>>;
  readonly set?: Maybe<ReadonlyArray<WeaponProfileWhereUniqueInput>>;
  readonly create?: Maybe<ReadonlyArray<WeaponProfileCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<WeaponProfileWhereUniqueInput>>;
};

export type TagRelateToManyForUpdateInput = {
  readonly disconnect?: Maybe<ReadonlyArray<TagWhereUniqueInput>>;
  readonly set?: Maybe<ReadonlyArray<TagWhereUniqueInput>>;
  readonly create?: Maybe<ReadonlyArray<TagCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<TagWhereUniqueInput>>;
};

export type RuleRelateToManyForUpdateInput = {
  readonly disconnect?: Maybe<ReadonlyArray<RuleWhereUniqueInput>>;
  readonly set?: Maybe<ReadonlyArray<RuleWhereUniqueInput>>;
  readonly create?: Maybe<ReadonlyArray<RuleCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<RuleWhereUniqueInput>>;
};

export type UnitUpdateArgs = {
  readonly where: UnitWhereUniqueInput;
  readonly data: UnitUpdateInput;
};

export type UnitCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly details?: Maybe<Scalars['String']>;
  readonly stats?: Maybe<UnitStatRelateToOneForCreateInput>;
  readonly weapons?: Maybe<WeaponProfileRelateToManyForCreateInput>;
  readonly keywords?: Maybe<TagRelateToManyForCreateInput>;
  readonly points?: Maybe<Scalars['Int']>;
  readonly abilities?: Maybe<RuleRelateToManyForCreateInput>;
  readonly role?: Maybe<Scalars['String']>;
};

export type UnitStatRelateToOneForCreateInput = {
  readonly create?: Maybe<UnitStatCreateInput>;
  readonly connect?: Maybe<UnitStatWhereUniqueInput>;
};

export type WeaponProfileRelateToManyForCreateInput = {
  readonly create?: Maybe<ReadonlyArray<WeaponProfileCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<WeaponProfileWhereUniqueInput>>;
};

export type TagRelateToManyForCreateInput = {
  readonly create?: Maybe<ReadonlyArray<TagCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<TagWhereUniqueInput>>;
};

export type RuleRelateToManyForCreateInput = {
  readonly create?: Maybe<ReadonlyArray<RuleCreateInput>>;
  readonly connect?: Maybe<ReadonlyArray<RuleWhereUniqueInput>>;
};

export type Rule = {
  readonly __typename: 'Rule';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly details: Maybe<Scalars['String']>;
};

export type RuleWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
};

export type RuleWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<RuleWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<RuleWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<RuleWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
  readonly details?: Maybe<StringFilter>;
};

export type RuleOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
  readonly details?: Maybe<OrderDirection>;
};

export type RuleUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly details?: Maybe<Scalars['String']>;
};

export type RuleUpdateArgs = {
  readonly where: RuleWhereUniqueInput;
  readonly data: RuleUpdateInput;
};

export type RuleCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly details?: Maybe<Scalars['String']>;
};

export type Tag = {
  readonly __typename: 'Tag';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
};

export type TagWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
  readonly name?: Maybe<Scalars['String']>;
};

export type TagWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<TagWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<TagWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<TagWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
};

export type TagOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
};

export type TagUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
};

export type TagUpdateArgs = {
  readonly where: TagWhereUniqueInput;
  readonly data: TagUpdateInput;
};

export type TagCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
};

export type User = {
  readonly __typename: 'User';
  readonly id: Scalars['ID'];
  readonly name: Maybe<Scalars['String']>;
  readonly email: Maybe<Scalars['String']>;
  readonly password: Maybe<PasswordState>;
};

export type PasswordState = {
  readonly __typename: 'PasswordState';
  readonly isSet: Scalars['Boolean'];
};

export type UserWhereUniqueInput = {
  readonly id?: Maybe<Scalars['ID']>;
  readonly name?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
};

export type UserWhereInput = {
  readonly AND?: Maybe<ReadonlyArray<UserWhereInput>>;
  readonly OR?: Maybe<ReadonlyArray<UserWhereInput>>;
  readonly NOT?: Maybe<ReadonlyArray<UserWhereInput>>;
  readonly id?: Maybe<IDFilter>;
  readonly name?: Maybe<StringFilter>;
  readonly email?: Maybe<StringFilter>;
};

export type UserOrderByInput = {
  readonly id?: Maybe<OrderDirection>;
  readonly name?: Maybe<OrderDirection>;
  readonly email?: Maybe<OrderDirection>;
};

export type UserUpdateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
  readonly password?: Maybe<Scalars['String']>;
};

export type UserUpdateArgs = {
  readonly where: UserWhereUniqueInput;
  readonly data: UserUpdateInput;
};

export type UserCreateInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
  readonly password?: Maybe<Scalars['String']>;
};


export type Mutation = {
  readonly __typename: 'Mutation';
  readonly createWeaponProfile: Maybe<WeaponProfile>;
  readonly createWeaponProfiles: Maybe<ReadonlyArray<Maybe<WeaponProfile>>>;
  readonly updateWeaponProfile: Maybe<WeaponProfile>;
  readonly updateWeaponProfiles: Maybe<ReadonlyArray<Maybe<WeaponProfile>>>;
  readonly deleteWeaponProfile: Maybe<WeaponProfile>;
  readonly deleteWeaponProfiles: Maybe<ReadonlyArray<Maybe<WeaponProfile>>>;
  readonly createUnitStat: Maybe<UnitStat>;
  readonly createUnitStats: Maybe<ReadonlyArray<Maybe<UnitStat>>>;
  readonly updateUnitStat: Maybe<UnitStat>;
  readonly updateUnitStats: Maybe<ReadonlyArray<Maybe<UnitStat>>>;
  readonly deleteUnitStat: Maybe<UnitStat>;
  readonly deleteUnitStats: Maybe<ReadonlyArray<Maybe<UnitStat>>>;
  readonly createUnit: Maybe<Unit>;
  readonly createUnits: Maybe<ReadonlyArray<Maybe<Unit>>>;
  readonly updateUnit: Maybe<Unit>;
  readonly updateUnits: Maybe<ReadonlyArray<Maybe<Unit>>>;
  readonly deleteUnit: Maybe<Unit>;
  readonly deleteUnits: Maybe<ReadonlyArray<Maybe<Unit>>>;
  readonly createRule: Maybe<Rule>;
  readonly createRules: Maybe<ReadonlyArray<Maybe<Rule>>>;
  readonly updateRule: Maybe<Rule>;
  readonly updateRules: Maybe<ReadonlyArray<Maybe<Rule>>>;
  readonly deleteRule: Maybe<Rule>;
  readonly deleteRules: Maybe<ReadonlyArray<Maybe<Rule>>>;
  readonly createTag: Maybe<Tag>;
  readonly createTags: Maybe<ReadonlyArray<Maybe<Tag>>>;
  readonly updateTag: Maybe<Tag>;
  readonly updateTags: Maybe<ReadonlyArray<Maybe<Tag>>>;
  readonly deleteTag: Maybe<Tag>;
  readonly deleteTags: Maybe<ReadonlyArray<Maybe<Tag>>>;
  readonly createUser: Maybe<User>;
  readonly createUsers: Maybe<ReadonlyArray<Maybe<User>>>;
  readonly updateUser: Maybe<User>;
  readonly updateUsers: Maybe<ReadonlyArray<Maybe<User>>>;
  readonly deleteUser: Maybe<User>;
  readonly deleteUsers: Maybe<ReadonlyArray<Maybe<User>>>;
  readonly endSession: Scalars['Boolean'];
  readonly authenticateUserWithPassword: Maybe<UserAuthenticationWithPasswordResult>;
  readonly createInitialUser: UserAuthenticationWithPasswordSuccess;
};


export type MutationcreateWeaponProfileArgs = {
  data: WeaponProfileCreateInput;
};


export type MutationcreateWeaponProfilesArgs = {
  data: ReadonlyArray<WeaponProfileCreateInput>;
};


export type MutationupdateWeaponProfileArgs = {
  where: WeaponProfileWhereUniqueInput;
  data: WeaponProfileUpdateInput;
};


export type MutationupdateWeaponProfilesArgs = {
  data: ReadonlyArray<WeaponProfileUpdateArgs>;
};


export type MutationdeleteWeaponProfileArgs = {
  where: WeaponProfileWhereUniqueInput;
};


export type MutationdeleteWeaponProfilesArgs = {
  where: ReadonlyArray<WeaponProfileWhereUniqueInput>;
};


export type MutationcreateUnitStatArgs = {
  data: UnitStatCreateInput;
};


export type MutationcreateUnitStatsArgs = {
  data: ReadonlyArray<UnitStatCreateInput>;
};


export type MutationupdateUnitStatArgs = {
  where: UnitStatWhereUniqueInput;
  data: UnitStatUpdateInput;
};


export type MutationupdateUnitStatsArgs = {
  data: ReadonlyArray<UnitStatUpdateArgs>;
};


export type MutationdeleteUnitStatArgs = {
  where: UnitStatWhereUniqueInput;
};


export type MutationdeleteUnitStatsArgs = {
  where: ReadonlyArray<UnitStatWhereUniqueInput>;
};


export type MutationcreateUnitArgs = {
  data: UnitCreateInput;
};


export type MutationcreateUnitsArgs = {
  data: ReadonlyArray<UnitCreateInput>;
};


export type MutationupdateUnitArgs = {
  where: UnitWhereUniqueInput;
  data: UnitUpdateInput;
};


export type MutationupdateUnitsArgs = {
  data: ReadonlyArray<UnitUpdateArgs>;
};


export type MutationdeleteUnitArgs = {
  where: UnitWhereUniqueInput;
};


export type MutationdeleteUnitsArgs = {
  where: ReadonlyArray<UnitWhereUniqueInput>;
};


export type MutationcreateRuleArgs = {
  data: RuleCreateInput;
};


export type MutationcreateRulesArgs = {
  data: ReadonlyArray<RuleCreateInput>;
};


export type MutationupdateRuleArgs = {
  where: RuleWhereUniqueInput;
  data: RuleUpdateInput;
};


export type MutationupdateRulesArgs = {
  data: ReadonlyArray<RuleUpdateArgs>;
};


export type MutationdeleteRuleArgs = {
  where: RuleWhereUniqueInput;
};


export type MutationdeleteRulesArgs = {
  where: ReadonlyArray<RuleWhereUniqueInput>;
};


export type MutationcreateTagArgs = {
  data: TagCreateInput;
};


export type MutationcreateTagsArgs = {
  data: ReadonlyArray<TagCreateInput>;
};


export type MutationupdateTagArgs = {
  where: TagWhereUniqueInput;
  data: TagUpdateInput;
};


export type MutationupdateTagsArgs = {
  data: ReadonlyArray<TagUpdateArgs>;
};


export type MutationdeleteTagArgs = {
  where: TagWhereUniqueInput;
};


export type MutationdeleteTagsArgs = {
  where: ReadonlyArray<TagWhereUniqueInput>;
};


export type MutationcreateUserArgs = {
  data: UserCreateInput;
};


export type MutationcreateUsersArgs = {
  data: ReadonlyArray<UserCreateInput>;
};


export type MutationupdateUserArgs = {
  where: UserWhereUniqueInput;
  data: UserUpdateInput;
};


export type MutationupdateUsersArgs = {
  data: ReadonlyArray<UserUpdateArgs>;
};


export type MutationdeleteUserArgs = {
  where: UserWhereUniqueInput;
};


export type MutationdeleteUsersArgs = {
  where: ReadonlyArray<UserWhereUniqueInput>;
};


export type MutationauthenticateUserWithPasswordArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationcreateInitialUserArgs = {
  data: CreateInitialUserInput;
};

export type UserAuthenticationWithPasswordResult = UserAuthenticationWithPasswordSuccess | UserAuthenticationWithPasswordFailure;

export type UserAuthenticationWithPasswordSuccess = {
  readonly __typename: 'UserAuthenticationWithPasswordSuccess';
  readonly sessionToken: Scalars['String'];
  readonly item: User;
};

export type UserAuthenticationWithPasswordFailure = {
  readonly __typename: 'UserAuthenticationWithPasswordFailure';
  readonly message: Scalars['String'];
};

export type CreateInitialUserInput = {
  readonly name?: Maybe<Scalars['String']>;
  readonly email?: Maybe<Scalars['String']>;
  readonly password?: Maybe<Scalars['String']>;
};

export type Query = {
  readonly __typename: 'Query';
  readonly weaponProfiles: Maybe<ReadonlyArray<WeaponProfile>>;
  readonly weaponProfile: Maybe<WeaponProfile>;
  readonly weaponProfilesCount: Maybe<Scalars['Int']>;
  readonly unitStats: Maybe<ReadonlyArray<UnitStat>>;
  readonly unitStat: Maybe<UnitStat>;
  readonly unitStatsCount: Maybe<Scalars['Int']>;
  readonly units: Maybe<ReadonlyArray<Unit>>;
  readonly unit: Maybe<Unit>;
  readonly unitsCount: Maybe<Scalars['Int']>;
  readonly rules: Maybe<ReadonlyArray<Rule>>;
  readonly rule: Maybe<Rule>;
  readonly rulesCount: Maybe<Scalars['Int']>;
  readonly tags: Maybe<ReadonlyArray<Tag>>;
  readonly tag: Maybe<Tag>;
  readonly tagsCount: Maybe<Scalars['Int']>;
  readonly users: Maybe<ReadonlyArray<User>>;
  readonly user: Maybe<User>;
  readonly usersCount: Maybe<Scalars['Int']>;
  readonly keystone: KeystoneMeta;
  readonly authenticatedItem: Maybe<AuthenticatedItem>;
};


export type QueryweaponProfilesArgs = {
  where?: WeaponProfileWhereInput;
  orderBy?: ReadonlyArray<WeaponProfileOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QueryweaponProfileArgs = {
  where: WeaponProfileWhereUniqueInput;
};


export type QueryweaponProfilesCountArgs = {
  where?: WeaponProfileWhereInput;
};


export type QueryunitStatsArgs = {
  where?: UnitStatWhereInput;
  orderBy?: ReadonlyArray<UnitStatOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QueryunitStatArgs = {
  where: UnitStatWhereUniqueInput;
};


export type QueryunitStatsCountArgs = {
  where?: UnitStatWhereInput;
};


export type QueryunitsArgs = {
  where?: UnitWhereInput;
  orderBy?: ReadonlyArray<UnitOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QueryunitArgs = {
  where: UnitWhereUniqueInput;
};


export type QueryunitsCountArgs = {
  where?: UnitWhereInput;
};


export type QueryrulesArgs = {
  where?: RuleWhereInput;
  orderBy?: ReadonlyArray<RuleOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QueryruleArgs = {
  where: RuleWhereUniqueInput;
};


export type QueryrulesCountArgs = {
  where?: RuleWhereInput;
};


export type QuerytagsArgs = {
  where?: TagWhereInput;
  orderBy?: ReadonlyArray<TagOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QuerytagArgs = {
  where: TagWhereUniqueInput;
};


export type QuerytagsCountArgs = {
  where?: TagWhereInput;
};


export type QueryusersArgs = {
  where?: UserWhereInput;
  orderBy?: ReadonlyArray<UserOrderByInput>;
  take: Maybe<Scalars['Int']>;
  skip?: Scalars['Int'];
};


export type QueryuserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryusersCountArgs = {
  where?: UserWhereInput;
};

export type AuthenticatedItem = User;

export type KeystoneMeta = {
  readonly __typename: 'KeystoneMeta';
  readonly adminMeta: KeystoneAdminMeta;
};

export type KeystoneAdminMeta = {
  readonly __typename: 'KeystoneAdminMeta';
  readonly enableSignout: Scalars['Boolean'];
  readonly enableSessionItem: Scalars['Boolean'];
  readonly lists: ReadonlyArray<KeystoneAdminUIListMeta>;
  readonly list: Maybe<KeystoneAdminUIListMeta>;
};


export type KeystoneAdminMetalistArgs = {
  key: Scalars['String'];
};

export type KeystoneAdminUIListMeta = {
  readonly __typename: 'KeystoneAdminUIListMeta';
  readonly key: Scalars['String'];
  readonly itemQueryName: Scalars['String'];
  readonly listQueryName: Scalars['String'];
  readonly hideCreate: Scalars['Boolean'];
  readonly hideDelete: Scalars['Boolean'];
  readonly path: Scalars['String'];
  readonly label: Scalars['String'];
  readonly singular: Scalars['String'];
  readonly plural: Scalars['String'];
  readonly description: Maybe<Scalars['String']>;
  readonly initialColumns: ReadonlyArray<Scalars['String']>;
  readonly pageSize: Scalars['Int'];
  readonly labelField: Scalars['String'];
  readonly fields: ReadonlyArray<KeystoneAdminUIFieldMeta>;
  readonly initialSort: Maybe<KeystoneAdminUISort>;
  readonly isHidden: Scalars['Boolean'];
};

export type KeystoneAdminUIFieldMeta = {
  readonly __typename: 'KeystoneAdminUIFieldMeta';
  readonly path: Scalars['String'];
  readonly label: Scalars['String'];
  readonly isOrderable: Scalars['Boolean'];
  readonly isFilterable: Scalars['Boolean'];
  readonly fieldMeta: Maybe<Scalars['JSON']>;
  readonly viewsIndex: Scalars['Int'];
  readonly customViewsIndex: Maybe<Scalars['Int']>;
  readonly createView: KeystoneAdminUIFieldMetaCreateView;
  readonly listView: KeystoneAdminUIFieldMetaListView;
  readonly itemView: Maybe<KeystoneAdminUIFieldMetaItemView>;
  readonly search: Maybe<QueryMode>;
};


export type KeystoneAdminUIFieldMetaitemViewArgs = {
  id: Maybe<Scalars['ID']>;
};

export type KeystoneAdminUIFieldMetaCreateView = {
  readonly __typename: 'KeystoneAdminUIFieldMetaCreateView';
  readonly fieldMode: KeystoneAdminUIFieldMetaCreateViewFieldMode;
};

export type KeystoneAdminUIFieldMetaCreateViewFieldMode =
  | 'edit'
  | 'hidden';

export type KeystoneAdminUIFieldMetaListView = {
  readonly __typename: 'KeystoneAdminUIFieldMetaListView';
  readonly fieldMode: KeystoneAdminUIFieldMetaListViewFieldMode;
};

export type KeystoneAdminUIFieldMetaListViewFieldMode =
  | 'read'
  | 'hidden';

export type KeystoneAdminUIFieldMetaItemView = {
  readonly __typename: 'KeystoneAdminUIFieldMetaItemView';
  readonly fieldMode: Maybe<KeystoneAdminUIFieldMetaItemViewFieldMode>;
};

export type KeystoneAdminUIFieldMetaItemViewFieldMode =
  | 'edit'
  | 'read'
  | 'hidden';

export type KeystoneAdminUISort = {
  readonly __typename: 'KeystoneAdminUISort';
  readonly field: Scalars['String'];
  readonly direction: KeystoneAdminUISortDirection;
};

export type KeystoneAdminUISortDirection =
  | 'ASC'
  | 'DESC';

export interface TSGQLDocuments extends Record<string, import('@ts-gql/tag').TypedDocumentNode<import('@ts-gql/tag').BaseDocumentTypes>> {}

export type TSGQLRequiredFragments<T> = (providedFragments: T) => T;
import { assert } from '@tldraw/utils'
import { BaseRecord, ID } from '../BaseRecord'
import { createRecordType } from '../RecordType'
import { StoreSchema } from '../StoreSchema'
import { defineMigrations } from '../migrate'

/** A user of tldraw */
interface User extends BaseRecord<'user', ID<User>> {
	name: string
}

const userMigrations = defineMigrations({})

const User = createRecordType<User>('user', {
	migrations: userMigrations,
	scope: 'document',
})

interface Shape<Props> extends BaseRecord<'shape', ID<Shape<object>>> {
	type: string
	x: number
	y: number
	props: Props
}

interface RectangleProps {
	width: number
	height: number
	opactiy: number
}

interface OvalProps {
	radius: number
	borderStyle: 'solid' | 'dashed'
}

const shapeTypeMigrations = defineMigrations({
	subTypeKey: 'type',
	subTypeMigrations: {
		rectangle: defineMigrations({}),
	},
})

const Shape = createRecordType<Shape<RectangleProps | OvalProps>>('shape', {
	migrations: shapeTypeMigrations,
	scope: 'document',
})

// this interface only exists to be removed
interface Org extends BaseRecord<'org', ID<Org>> {
	name: string
}

const Org = createRecordType<Org>('org', {
	migrations: defineMigrations({}),
	scope: 'document',
})

type StoreRecord = Org | User | Shape<RectangleProps | OvalProps>

const validateRecord = (record: StoreRecord): StoreRecord => {
	switch (record.typeName) {
		case 'org': {
			assert(
				record && typeof record === 'object' && 'name' in record && typeof record.name === 'string'
			)
			return record
		}
		case 'user': {
			assert(
				record &&
					typeof record === 'object' &&
					'type' in record &&
					typeof record.type === 'string' &&
					'x' in record &&
					typeof record.x === 'number' &&
					'y' in record &&
					typeof record.y === 'number' &&
					'props' in record &&
					typeof record.props === 'object'
			)
			return record
		}
		case 'shape': {
			assert(
				record && typeof record === 'object' && 'name' in record && typeof record.name === 'string'
			)
			return record
		}
	}
}

export const testSchemaV0 = StoreSchema.create(
	{
		user: User,
		shape: Shape,
		org: Org,
	},
	{
		snapshotMigrations: defineMigrations({}),
		validateRecord,
	}
)

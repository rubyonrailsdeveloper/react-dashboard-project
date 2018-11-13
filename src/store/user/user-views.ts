import mapValues from 'lodash-es/mapValues'
import { User } from 'src/store/user/user-model'
import { pagerFactory } from 'src/util/pager'

export const UserFields = {
  name: {
    id: 'name',
    label: 'Name',
    sortIterator: (u: User) => u.name,
  },
  email: {
    id: 'email',
    label: 'Email',
    sortIterator: (u: User) => u.email,
  },
}

const pager = pagerFactory<User>()

const sortIterators = mapValues(UserFields, g => g.sortIterator)

export const makeUserPager = () => pager(sortIterators)

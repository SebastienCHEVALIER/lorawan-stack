// Copyright © 2019 The Things Network Foundation, The Things Industries B.V.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { createLogic } from 'redux-logic'

import api from '../../api'
import * as application from '../actions/application'
import createEventsConnectLogics from './events'

const getApplicationCollaboratorsLogic = createLogic({
  type: [
    application.GET_APP_COLLABORATOR_PAGE_DATA,
    application.GET_APP_COLLABORATORS_LIST,
  ],
  async process ({ getState, action }, dispatch, done) {
    const { id } = action
    try {
      const res = await api.application.collaborators.list(id)
      const collaborators = res.collaborators.map(function (collaborator) {
        const { ids, ...rest } = collaborator
        const isUser = !!ids.user_ids
        const collaboratorId = isUser
          ? ids.user_ids.user_id
          : ids.organization_ids.organization_id

        return {
          id: collaboratorId,
          isUser,
          ...rest,
        }
      })

      dispatch(
        application.getApplicationCollaboratorsListSuccess(
          id,
          collaborators,
          res.totalCount
        )
      )
    } catch (e) {
      dispatch(application.getApplicationCollaboratorsListFailure(id, e))
    }

    done()
  },
})

export default [
  getApplicationCollaboratorsLogic,
  ...createEventsConnectLogics(application.SHARED_NAME, 'application'),
]

export const Type = {
  'Frame': {
    id: 'frame_id',
    menuPlaceholder: 'eg. PUJ1_FDFRW4_V3',
    parent_fields: [
      {
          key: 0,
          label: 'Frame Name: ',
          field: 'frame_name'
      },
      {
          key: 1,
          label: 'QR Code: ',
          field: 'qr_code_id'
      }
    ],
    child_fields: [
      {
          key: 0,
          label: 'Frame Name: ',
          field: 'frame_name'
      }
    ]
  },
  'Shelf': {
    id: 'frame_unit_id',
    menuPlaceholder: 'eg. 30826',
    parent_fields: [
      {
          key: 0,
          label: 'Block: ',
          field: 'shelf_block'
      },
      {
          key: 1,
          label: 'QR Code: ',
          field: 'qr_code_id'
      }
    ],
    child_fields: [
      {
          key: 0,
          label: 'Block: ',
          field: 'shelf_block'
      }
    ],
  },
  'Core':  {
    id: 'pair_id',
    menuPlaceholder: 'eg. 33086',
    parent_fields: [
      {
          key: 0,
          label: 'Cable Name: ',
          field: 'Cable_name'
      },
      {
          key: 1,
          label: 'Cable Core No: ',
          field: 'Cable_core_no'
      },
      {
          key: 2,
          label: 'Ne ID: ',
          field: 'ne_id'
      },
      {
          key: 3,
          label: 'QR Code: ',
          field: 'qr_code_id'
      }
    ],
    child_fields: [
      {
          key: 0,
          label: 'Cable Name: ',
          field: 'Cable_name'
      },
      {
          key: 1,
          label: 'Core No: ',
          field: 'Cable_core_no'
      },
      {
          key: 2,
          label: 'Ne ID: ',
          field: 'ne_id'
      }
    ]
  },
  'NE':  {
    id: 'ne_id',
    menuPlaceholder: 'eg. PUJ1_M999_0054',
    htext1: {
      label: 'Core Id: ',
      field: 'Cable_core_id'
    },
    htext2: {
      label: 'Cable Id: ',
      field: 'Cable_name'
    }
  },
  excludeFromResponse: [
    'LIST_FRAME_UNIT',
    'FU_Detail',
    'ErrorCode',
    'ErrorMessage',
    'TMSOA_Status',
    'xmlns',
    'xmlns:env',
    'xmlns:ns2',
    'xmlns:wsa',
  ],
  excludeFromDetails: [
    'frame_id',
    'frame_unit_id',
    'pair_id',
    'Cable_core_id',
  ],
};

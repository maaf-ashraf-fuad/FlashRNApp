export const Type = {
  'Frame': {
    id: 'frame_id',
    key: 'frame_id',
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
    key: 'frame_unit_id',
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
    key: 'key',
    menuPlaceholder: 'eg. 33086',
    parent_fields: [
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
          label: 'NE ID From: ',
          field: 'ne_id'
      },
      {
          key: 3,
          label: 'NE ID To: ',
          field: 'to_ne_id'
      },
      {
          key: 4,
          label: 'CCt From: ',
          field: 'cct_name'
      },
      {
          key: 5,
          label: 'CCt To: ',
          field: 'to_cct_name'
      },
      {
          key: 6,
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
          label: 'NE ID From: ',
          field: 'ne_id'
      },
      {
          key: 3,
          label: 'NE ID To: ',
          field: 'to_ne_id'
      },
      {
          key: 4,
          label: 'CCt From: ',
          field: 'cct_name'
      },
      {
          key: 5,
          label: 'CCt To: ',
          field: 'to_cct_name'
      }
    ]
  },
  'NE':  {
    id: 'ne_id',
    key: 'ne_id',
    menuPlaceholder: 'eg. PUJ1_M999_0054',
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
          label: 'NE ID From: ',
          field: 'ne_id'
      },
      {
          key: 3,
          label: 'NE ID To: ',
          field: 'to_ne_id'
      },
      {
          key: 4,
          label: 'CCt From: ',
          field: 'cct_name'
      },
      {
          key: 5,
          label: 'CCt To: ',
          field: 'to_cct_name'
      }
    ]
  },
  'Cable_Id':  {
    id: 'Cable_name',
    key: 'Cable_name',
    menuPlaceholder: 'eg. PUJ1_F46',
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
          label: 'NE ID From: ',
          field: 'ne_id'
      },
      {
          key: 3,
          label: 'NE ID To: ',
          field: 'to_ne_id'
      },
      {
          key: 4,
          label: 'CCt From: ',
          field: 'cct_name'
      },
      {
          key: 5,
          label: 'CCt To: ',
          field: 'to_cct_name'
      }
    ]
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

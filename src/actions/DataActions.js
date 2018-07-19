export const frameFetch = (id, qr) => (dispatch) => {
    //fetch('http://10.54.1.15:8001/FLASH/listFrameUnit/Proxy_Services/PS_listFrameUnit',
    fetch('http://58.27.85.176/FLASH/QueryFrame',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          FRAME_NAME: id,
          QR_CODE_ID: qr,
        }
      )
    })

    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({ type: 'Frame_Fetch_Success', payload: responseJson });
    })
    .catch((error) => {
      console.error(error);
    })
    .done();
  };

export const shelfFetch = (id, qr) => (dispatch) => {
    fetch('http://58.27.85.176/FLASH/QueryShelf',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic RkxBU0g6ZjE0NWg=',
      },
      body: JSON.stringify(
        {
          frame_unit_id: id,
          qr_code_id: qr,
        }
      )
    })

    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({ type: 'Shelf_Fetch_Success', payload: responseJson });
    })
    .catch((error) => {
      console.error(error);
    })
    .done();
  };

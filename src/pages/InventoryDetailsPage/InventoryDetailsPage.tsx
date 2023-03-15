import {Box, Text} from "grommet";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTokenERC1155Assets, getTokenERC721Assets } from "src/api/client";
import { IUserERC721Assets } from "src/api/client.interface";
import { BasePage } from "src/components/ui";
import { useERC1155Pool } from "src/hooks/ERC1155_Pool";
import { useERC721Pool } from "src/hooks/ERC721_Pool";
import styled from "styled-components";
import HarmonyLogo from '../../assets/Logo.svg';
import { config } from '../../config'
import {ERC1155Icon} from "../../components/ui/ERC1155Icon";

interface NFTImageProps {
  imageUrl: string
}

const Image = styled.img`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  margin-left: auto;
  margin-right: auto;
  border-radius: 0.35rem;
`

const ImageContainer = styled(Box)`
  background-color: #f1f2f3;
  width: 100%;
`

const NFTContainer = styled(Box)`
  width: 42%;
  min-width: 300px;
`

const NFTImage = (props: NFTImageProps) => {
  const { imageUrl } = props

  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingError, setLoadingError] = useState(false)

  const onLoadSuccess = () => {
    setIsLoading(false)
  }

  const onLoadError = () => {
    // setIsLoading(false);
    setLoadingError(true);
  }

  return <ImageContainer width={'inherit'} height={'inherit'} justify={'center'} align={'center'}>
    {isLoading &&
        <Image src={HarmonyLogo} style={{ width: '50%' }} />
    }
    <Image
      color={'red'}
      src={`${config.ipfsGateway}${imageUrl}`}
      onLoad={onLoadSuccess}
      onError={onLoadError}
      style={{ display: isLoading ? 'none': 'block' }}
    />
  </ImageContainer>
}

interface NFTInfoProps {
  name: string
  asset: IUserERC721Assets
}

const NFTInfo = (props: NFTInfoProps) => {
  const { name, asset } = props
  const { meta } = asset

  return <Box pad={{ left: 'medium' }}>
    <Box>
      <Box>
        <Text weight={'bold'} size={'large'}>{name} {meta?.name || ""}</Text>
      </Box>
      <Box>
        <ERC1155Icon imageUrl={meta?.image} />
      </Box>
    </Box>
  </Box>
}

export function InventoryDetailsPage() {
  const erc721Map = useERC721Pool();
  const erc1155Map = useERC1155Pool();
  const [inventory, setInventory] = useState<IUserERC721Assets>({} as any);

  //  @ts-ignore
  const { address, tokenID, type } = useParams();

  const item = erc721Map[address] || erc1155Map[address] || {};
  const name = item.name || "";

  useEffect(() => {
    const getInventory = async () => {
      try {
        if (type === "erc721" || type === "erc1155") {
          let inventory =
            type === "erc721"
              ? await getTokenERC721Assets([address])
              : await getTokenERC1155Assets([address]);

          setInventory(inventory.filter((item) => item.tokenID === tokenID)[0]);
        } else {
          setInventory({} as any);
        }
      } catch (err) {
        setInventory({} as any);
      }
    };
    getInventory();
  }, [address]);

  let meta = "";
  try {
    meta = JSON.stringify(inventory.meta, null, 4);
  } catch {
    meta = "";
  }

  console.log('inventory', inventory)

  return (
    <>
      <BasePage>
        <Box direction={'row'} justify={'start'} wrap={true}>
          <NFTContainer>
            <NFTImage imageUrl={inventory.meta?.image || ''} />
          </NFTContainer>
          <NFTInfo name={name} asset={inventory} />
        </Box>
      </BasePage>
    </>
  );
}

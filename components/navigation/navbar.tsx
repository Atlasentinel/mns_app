import { View } from "react-native"
import { Link } from "expo-router"
import { TabBarIcon } from "./TabBarIcon"

export default function Navbar({viewStyles}:any)
{
    return(
        <View style={viewStyles.btn_menu}>
        <Link style={viewStyles.deleteBtnStyle} href="/">
          <TabBarIcon name='home' />
        </Link>
        <Link style={viewStyles.deleteBtnStyle}  href="/user">
          <TabBarIcon name="call" color="green"/>
        </Link>
      </View>
    )
}
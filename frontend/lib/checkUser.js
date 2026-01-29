import { auth, currentUser } from '@clerk/nextjs/server'

const STRAPI_URL = (
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
).replace(/\/$/, '')
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN

export const checkUser = async () => {
  const user = await currentUser()

  if (!user) {
    console.log('checkUser: No User found in Clerk')
    return null
  }

  console.log(
    `checkUser: User found: ${user.id}, email: ${user.emailAddresses[0].emailAddress}`
  )

  if (!STRAPI_API_TOKEN) {
    console.error('❌ STRAPI_API_TOKEN is missing in .env.local')
    return null
  }

  console.log(
    `checkUser: Token loaded: ${!!STRAPI_API_TOKEN}, First 10 chars: ${STRAPI_API_TOKEN.substring(
      0,
      10
    )}...`
  )

  try {
    // Check if user has Pro plan
    const { has } = await auth()
    const subscriptionTier = has({ plan: 'pro' }) ? 'pro' : 'free'
    console.log(`checkUser: Subscription tier: ${subscriptionTier}`)

    // Check if user exists in Strapi
    // Check if user exists in Strapi
    const url = new URL(`${STRAPI_URL}/api/users`)
    url.searchParams.set('filters[clerkId][$eq]', user.id)

    console.log(`checkUser: Checking Strapi user at ${url.toString()}`)

    const existingUserResponse = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${STRAPI_API_TOKEN}`
      },
      cache: 'no-store'
    })

    if (!existingUserResponse.ok) {
      const errorText = await existingUserResponse.text()
      console.error('Strapi error response (check existing):', errorText)
      return null
    }

    const existingUserData = await existingUserResponse.json()
    console.log(
      `checkUser: Existing connection result count: ${existingUserData.length}`
    )

    if (existingUserData.length > 0) {
      const existingUser = existingUserData[0]
      console.log(`checkUser: User exists in Strapi: ${existingUser.id}`)

      // Update subscription tier if changed
      if (existingUser.subscriptionTier !== subscriptionTier) {
        console.log(
          `checkUser: Updating subscription tier from ${existingUser.subscriptionTier} to ${subscriptionTier}`
        )
        await fetch(`${STRAPI_URL}/api/users/${existingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${STRAPI_API_TOKEN}`
          },
          body: JSON.stringify({ subscriptionTier })
        })
      }

      return { ...existingUser, subscriptionTier }
    }

    console.log('checkUser: User does not exist in Strapi, looking for role...')

    // Get authenticated role
    const rolesResponse = await fetch(
      `${STRAPI_URL}/api/users-permissions/roles`,
      {
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`
        }
      }
    )

    if (!rolesResponse.ok) {
      console.error(
        'checkUser: Failed to fetch roles',
        await rolesResponse.text()
      )
      return null
    }

    const rolesData = await rolesResponse.json()
    const authenticatedRole = rolesData.roles.find(
      role => role.type === 'authenticated'
    )

    if (!authenticatedRole) {
      console.error('❌ Authenticated role not found in Strapi')
      console.log(
        'Available roles:',
        rolesData.roles.map(r => r.type)
      )
      return null
    }

    console.log(
      `checkUser: Creating new user with role ${authenticatedRole.id}`
    )

    // Create new user
    const userData = {
      username:
        user.username || user.emailAddresses[0].emailAddress.split('@')[0],
      email: user.emailAddresses[0].emailAddress,
      password: `clerk_managed_${user.id}_${Date.now()}`,
      confirmed: true,
      blocked: false,
      role: authenticatedRole.id,
      clerkId: user.id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      imageUrl: user.imageUrl || '',
      subscriptionTier
    }

    console.log(
      'checkUser: Creating user payload:',
      JSON.stringify(userData, null, 2)
    )

    const newUserResponse = await fetch(`${STRAPI_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_API_TOKEN}`
      },
      body: JSON.stringify(userData)
    })

    if (!newUserResponse.ok) {
      const errorText = await newUserResponse.text()
      console.error('❌ Error creating user:', errorText)
      return null
    }

    const newUser = await newUserResponse.json()
    console.log(`checkUser: User created successfully: ${newUser.id}`)
    return newUser
  } catch (error) {
    console.error('❌ Error in checkUser:', error)
    console.error(error.stack)
    return null
  }
}
